import datetime
import json
import logging
from datetime import UTC

import httpx

from .base import BaseStorage

logger = logging.getLogger(__name__)


class SupabaseStorage(BaseStorage):
    """
    SDK-less Supabase implementation using direct HTTP (httpx)
    for Opaque Token compatibility.
    """

    def __init__(self, url: str, key: str):
        self.url = url.rstrip("/")
        self.key = key
        self.rest_url = f"{self.url}/rest/v1"
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        self._async_client = None
        logger.info("[SupabaseStorage] Initialized in SDK-less mode.")

    async def _get_client(self) -> httpx.AsyncClient:
        """Lazy initialization of the async client."""
        if self._async_client is None or self._async_client.is_closed:
            self._async_client = httpx.AsyncClient(base_url=self.rest_url, timeout=30.0)
        return self._async_client

    async def _request(self, method: str, path: str, **kwargs) -> httpx.Response:
        """Asynchronous request helper."""
        client = await self._get_client()
        headers = {**self.headers, **kwargs.pop("headers", {})}

        # Log the full URL for debugging
        params = kwargs.get("params", {})
        param_str = "&".join([f"{k}={v}" for k, v in params.items()])
        full_url_log = f"{path}{'?' + param_str if param_str else ''}"
        logger.info(
            f"[SupabaseStorage] {method} {full_url_log} - Payload: {str(kwargs.get('json'))[:200]}..."
        )

        resp = await client.request(method, path, headers=headers, **kwargs)

        # Log all responses briefly for synchronization debugging
        logger.info(f"[SupabaseStorage] {method} {path} response code: {resp.status_code}")
        if resp.status_code >= 400:
            logger.error(f"[SupabaseStorage] ERROR response: {resp.text}")
            resp.raise_for_status()
        return resp

    def _sanitize(self, value, default="News", limit=50):
        """Sanitizes string values for data quality."""
        if not value or not str(value).strip():
            return default
        value = str(value).strip()[:limit]
        return "".join(c for c in value if c.isprintable())

    async def is_processed(self, item_id: str) -> bool:
        """
        Deduplication Check: Returns True only if the item has already been
        SCORED by AI. This prevents self-filtering of newly fetched items
        that are already in raw_items but not yet analyzed.
        """
        try:
            params = {"select": "item_id", "item_id": f"eq.{item_id}"}
            resp = await self._request("GET", "ai_scores", params=params)
            return len(resp.json()) > 0
        except Exception as e:
            logger.error(f"[SupabaseStorage] Error checking score status for {item_id}: {e}")
            return False

    async def save_item(self, item_id: str, source: str, **kwargs):
        data = {
            "id": item_id,
            "source": source,
            "title": kwargs.get("title"),
            "summary": kwargs.get("summary"),
            "url": kwargs.get("url"),
            "published_at": kwargs.get("published_at"),
            "fetched_at": datetime.datetime.now(UTC).isoformat(),
            "market": self._sanitize(kwargs.get("market"), default="general"),
            "category": self._sanitize(kwargs.get("category"), default="News"),
            "raw_metadata": (
                json.dumps(kwargs.get("raw_metadata")) if kwargs.get("raw_metadata") else None
            ),
        }
        try:
            headers = {"Prefer": "resolution=merge-duplicates"}
            await self._request("POST", "raw_items", json=data, headers=headers)
        except Exception as e:
            logger.error(f"[SupabaseStorage] Failed to save item {item_id}: {e}")
            raise

    async def save_ai_score(self, item_id: str, score: int, reason: str, **kwargs):
        """Saves a single AI score."""
        data = {
            "item_id": item_id,
            "score": score,
            "reason": reason,
            "model_name": kwargs.get("model_name", "unknown"),
            "scored_at": datetime.datetime.now(UTC).isoformat(),
        }
        try:
            await self._request("POST", "ai_scores", json=data)
        except Exception as e:
            logger.error(f"[SupabaseStorage] Score save failed for {item_id}: {e}")
            raise

    async def save_ai_scores_bulk(self, scores: list[dict]):
        """Saves multiple AI scores in a single request."""
        if not scores:
            return
        try:
            await self._request("POST", "ai_scores", json=scores)
            logger.info(f"[SupabaseStorage] Bulk saved {len(scores)} AI scores.")
        except Exception as e:
            logger.error(f"[SupabaseStorage] Bulk save failed: {e}")
            raise

    async def save_report(
        self,
        title: str,
        content_md: str,
        language: str = "jp",
        item_id: str = None,
        model_name: str = "unknown",
        category: str = "News",
        market: str = "general",
        **kwargs,
    ):
        """Saves a single report."""
        import hashlib

        if item_id is None:
            item_id = hashlib.md5(
                f"{title}:{language}".encode(), usedforsecurity=False
            ).hexdigest()[:16]
        data = {
            "item_id": item_id,
            "title": title,
            "content_md": content_md,
            "category": self._sanitize(category, default="News"),
            "market": self._sanitize(market, default="general"),
            "language": language,
            "model_name": model_name,
            "generated_at": datetime.datetime.now(UTC).isoformat(),
        }
        try:
            headers = {"Prefer": "resolution=merge-duplicates"}
            logger.info(f"DEBUG: Saving report to Supabase with title: '{title}'")
            await self._request("POST", "generated_reports", json=data, headers=headers)
            logger.info(f"DEBUG: Successfully saved report: '{title}'")
        except Exception as e:
            logger.error(f"[SupabaseStorage] Report save failed for {item_id}: {e}")
            raise

    async def get_affiliates(self, market: str = "any") -> list:
        try:
            params = {"select": "*", "order": "weight.desc"}
            if market != "any":
                params["or"] = f"(market.eq.{market},market.eq.any)"

            resp = await self._request("GET", "affiliates", params=params)
            return resp.json()
        except Exception as e:
            logger.error(f"[SupabaseStorage] Affiliate fetch failed: {e}")
            return []

    async def delete_old_data(self, days: int = 7):
        threshold = (datetime.datetime.now(UTC) - datetime.timedelta(days=days)).isoformat()
        try:
            params = {"fetched_at": f"lt.{threshold}"}
            await self._request("DELETE", "raw_items", params=params)
            logger.info(f"[SupabaseStorage] Cleanup completed (> {days} days).")
        except Exception as e:
            logger.error(f"[SupabaseStorage] database cleanup failed: {e}")

    async def fetch_recent_reports(
        self, days: int = 7, min_score: int = 80, language: str = "jp"
    ) -> list[dict]:
        """Fetches recent reports for weekly summarization."""
        threshold = (datetime.datetime.now(UTC) - datetime.timedelta(days=days)).isoformat()
        try:
            # Removed inner join with ai_scores because reports are not individually scored
            select_str = "title,content_md,category,market,generated_at"
            params = {
                "select": select_str,
                "generated_at": f"gte.{threshold}",
                "language": f"eq.{language}",
                "order": "generated_at.desc",
            }
            resp = await self._request("GET", "generated_reports", params=params)
            return resp.json()
        except Exception as e:
            logger.error(f"[SupabaseStorage] Recent reports fetch failed: {e}")
            return []

    async def fetch_recent_scored_items(
        self, market: str, days: int = 3, min_score: int = 70
    ) -> list[dict]:
        """Fetches high-quality items from the archive for regional recovery."""
        threshold = (datetime.datetime.now(UTC) - datetime.timedelta(days=days)).isoformat()
        try:
            # Query raw_items joined with ai_scores
            select_str = "id,source,title,summary,url,published_at,market,category,ai_scores!inner(score,reason)"
            params = {
                "select": select_str,
                "market": f"eq.{market}",
                "fetched_at": f"gte.{threshold}",
                "ai_scores.score": f"gte.{min_score}",
                "order": "fetched_at.desc",
                "limit": "5",
            }
            resp = await self._request("GET", "raw_items", params=params)
            raw_data = resp.json()

            # Flatten the response structure
            items = []
            for d in raw_data:
                # PostgREST join results in a list for the joined table
                scores = d.get("ai_scores", [])
                if not scores:
                    continue
                d["score"] = scores[0]["score"]
                d["ai_reason"] = scores[0]["reason"]
                items.append(d)
            return items
        except Exception as e:
            logger.error(f"[SupabaseStorage] Recent items fetch failed for {market}: {e}")
            return []

    async def fetch_raw_items(self, days: int = 1, limit: int = 50) -> list[dict]:
        """Fetches raw items directly from the database (used for emergency boost)."""
        threshold = (datetime.datetime.now(UTC) - datetime.timedelta(days=days)).isoformat()
        try:
            params = {
                "select": "id,source,title,summary,url,published_at:published_at,fetched_at",
                "fetched_at": f"gte.{threshold}",
                "order": "fetched_at.desc",
                "limit": str(limit),
            }
            resp = await self._request("GET", "raw_items", params=params)
            data = resp.json()
            # Normalize for plugin expectations (published_at -> published)
            for d in data:
                d["published"] = d.get("published_at")
            return data
        except Exception as e:
            logger.error(f"[SupabaseStorage] Raw items fetch failed: {e}")
            return []

    async def save_sns_log(
        self, platform: str, content: str, item_id: str, model: str, status: str
    ):
        """
        Saves a record of an SNS post for quality auditing.
        Non-blocking: This method should never raise an exception to the caller.
        """
        data = {
            "platform": platform,
            "content": content,
            "item_id": item_id,
            "model": model,
            "status": status,
            "created_at": datetime.datetime.now(UTC).isoformat(),
        }
        try:
            # We use a nested try as _request might raise for status (like 404)
            await self._request("POST", "sns_post_logs", json=data)
            logger.info(f"[SupabaseStorage] SNS log saved for {platform}.")
        except Exception as e:
            # Log as warning since this is non-critical for the main flow
            logger.warning(f"[SupabaseStorage] Optional SNS log save failed (non-critical): {e}")
            # Do NOT raise, continue execution

    async def is_news_url_processed(self, url: str) -> bool:
        """Checks if a news URL has already been stored in ai_news."""
        try:
            params = {"select": "id", "url": f"eq.{url}", "limit": "1"}
            resp = await self._request("GET", "ai_news", params=params)
            return len(resp.json()) > 0
        except Exception as e:
            logger.error(f"[SupabaseStorage] Error checking ai_news for {url}: {e}")
            return False

    async def save_ai_news_bulk(self, news_items: list[dict]) -> int:
        """Bulk inserts curated AI news items into ai_news table."""
        if not news_items:
            return 0
        try:
            headers = {"Prefer": "resolution=ignore-duplicates"}
            await self._request("POST", "ai_news", json=news_items, headers=headers)
            logger.info(f"[SupabaseStorage] Successfully saved {len(news_items)} news items to ai_news.")
            return len(news_items)
        except Exception as e:
            logger.error(f"[SupabaseStorage] Failed to bulk save to ai_news: {e}")
            raise

    async def fetch_recent_ai_news(self, limit: int = 100, category: str = None) -> list[dict]:
        """Fetches the latest curated AI news from ai_news table."""
        try:
            params = {
                "select": "id,title,url,source_name,category,published_at,created_at",
                "order": "published_at.desc",
                "limit": str(limit),
            }
            if category and category.lower() != "all":
                params["category"] = f"eq.{category}"
            resp = await self._request("GET", "ai_news", params=params)
            return resp.json()
        except Exception as e:
            logger.error(f"[SupabaseStorage] Failed to fetch ai_news: {e}")
            return []

    async def test_connection(self) -> bool:
        """Tests the connection to Supabase REST API."""
        try:
            # Querying generated_reports with limit 1 is the lightest way to test the key
            params = {"select": "id", "limit": 1}
            await self._request("GET", "generated_reports", params=params)
            return True
        except Exception as e:
            logger.error(f"[SupabaseStorage] Connection test failed: {e}")
            return False

    async def close(self):
        """Closes the underlying async client."""
        if self._async_client:
            await self._async_client.aclose()
            logger.info("[SupabaseStorage] Async client closed.")

