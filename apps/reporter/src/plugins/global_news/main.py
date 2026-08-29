import asyncio
import datetime
from datetime import UTC
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import TYPE_CHECKING
import urllib.request
import xml.etree.ElementTree as ET
from loguru import logger
import yaml

from core.interfaces.plugin import IAyatoPlugin, ReportArtifact
from core.utils.fetch_util import FetchUtil

if TYPE_CHECKING:
    from core.service_container import ServiceContainer


class GlobalNewsPlugin(IAyatoPlugin):
    """
    Global AI News Curation Plugin.
    Fetches raw articles from worldwide RSS/Atom feeds, filters & curates them using
    Gemini AI Studio (Gemma / Gemini Flash), and saves adopted items directly
    to the Supabase `ai_news` table with original titles and links (NO translation).
    """

    def __init__(self):
        self.config_path = Path(__file__).resolve().parent.parent.parent / "data" / "config" / "feeds_tech.yaml"

    def _load_feeds(self) -> list[str]:
        """Loads RSS feed URLs from feeds_tech.yaml."""
        if not self.config_path.exists():
            logger.warning(f"[GlobalNewsPlugin] Config file not found at: {self.config_path}")
            return []
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                return data.get("tech_feeds", [])
        except Exception as e:
            logger.error(f"[GlobalNewsPlugin] Failed to read feeds config: {e} in {__file__}:{__name__}")
            return []

    def _parse_feed_xml(self, raw_bytes: bytes, feed_url: str) -> list[dict]:
        """Parses RSS 2.0 or Atom XML content safely."""
        items = []
        try:
            root = ET.fromstring(raw_bytes)
        except Exception as e:
            logger.warning(f"[GlobalNewsPlugin] XML parse failed for {feed_url}: {e}")
            return []

        # Detect Feed Type: RSS 2.0 vs Atom
        # RSS 2.0: <rss><channel><item>...
        channel = root.find("channel")
        if channel is not None:
            feed_title = channel.findtext("title", feed_url.split("/")[2] if "/" in feed_url else "RSS Feed")
            for item_elem in channel.findall("item")[:15]:
                title = (item_elem.findtext("title") or "").strip()
                link = (item_elem.findtext("link") or "").strip()
                if not title or not link:
                    continue

                pub_date_str = item_elem.findtext("pubDate")
                published_dt = datetime.datetime.now(UTC)
                if pub_date_str:
                    try:
                        published_dt = parsedate_to_datetime(pub_date_str)
                        if published_dt.tzinfo is None:
                            published_dt = published_dt.replace(tzinfo=UTC)
                    except Exception:
                        pass

                description = item_elem.findtext("description") or ""

                items.append({
                    "title": title,
                    "url": link,
                    "source": feed_title.strip(),
                    "summary": description[:400].strip(),
                    "published_at": published_dt.isoformat(),
                })
            return items

        # Atom: <feed xmlns="http://www.w3.org/2005/Atom"><entry>...
        # Strip namespace for simplified search
        atom_ns = {"atom": "http://www.w3.org/2005/Atom"}
        feed_title_elem = root.find("atom:title", atom_ns) or root.find("title")
        feed_title = feed_title_elem.text if feed_title_elem is not None and feed_title_elem.text else "Atom Feed"

        entries = root.findall("atom:entry", atom_ns) or root.findall("entry")
        for entry in entries[:15]:
            title_elem = entry.find("atom:title", atom_ns) or entry.find("title")
            title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""

            # Atom link may be <link href="..."/> or <link>...</link>
            link = ""
            link_elem = entry.find("atom:link", atom_ns) or entry.find("link")
            if link_elem is not None:
                link = link_elem.get("href") or link_elem.text or ""

            if not title or not link:
                continue

            updated_elem = entry.find("atom:updated", atom_ns) or entry.find("atom:published", atom_ns) or entry.find("updated") or entry.find("published")
            published_dt = datetime.datetime.now(UTC)
            if updated_elem is not None and updated_elem.text:
                try:
                    # ISO 8601 parsing
                    published_dt = datetime.datetime.fromisoformat(updated_elem.text.replace("Z", "+00:00"))
                except Exception:
                    pass

            summary_elem = entry.find("atom:summary", atom_ns) or entry.find("atom:content", atom_ns) or entry.find("summary") or entry.find("content")
            summary = summary_elem.text if summary_elem is not None and summary_elem.text else ""

            items.append({
                "title": title,
                "url": link.strip(),
                "source": feed_title.strip(),
                "summary": summary[:400].strip(),
                "published_at": published_dt.isoformat(),
            })

        return items

    async def _fetch_single_feed(self, feed_url: str) -> list[dict]:
        """Fetches and parses a single RSS/Atom feed."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AyatoBot/1.0"
        }
        req = urllib.request.Request(feed_url, headers=headers)
        raw_bytes = await FetchUtil.safe_fetch_url(req, timeout=15, max_retries=2)
        if not raw_bytes:
            return []

        return self._parse_feed_xml(raw_bytes, feed_url)

    async def run(
        self, context: "ServiceContainer", force: bool = False, **kwargs
    ) -> tuple[list[ReportArtifact], list[dict]]:
        """
        Main execution flow:
        1. Fetch articles from all feeds concurrently.
        2. Deduplicate against Supabase `ai_news` table.
        3. Batch curate using Gemma / Gemini Flash.
        4. Save adopted articles to Supabase.
        """
        logger.info("[GlobalNewsPlugin] Starting global AI news curation pipeline...")
        feeds = self._load_feeds()
        if not feeds:
            logger.warning("[GlobalNewsPlugin] No feeds loaded. Skipping.")
            return [], []

        # 1. Concurrent RSS Fetching
        fetch_tasks = [self._fetch_single_feed(url) for url in feeds]
        results = await asyncio.gather(*fetch_tasks, return_exceptions=True)

        all_candidate_items: list[dict] = []
        for res in results:
            if isinstance(res, list):
                all_candidate_items.extend(res)

        logger.info(f"[GlobalNewsPlugin] Total raw candidate items collected: {len(all_candidate_items)}")
        if not all_candidate_items:
            return [], []

        # 2. Filter out already processed URLs in Supabase
        storage = context.database
        new_items = []
        for item in all_candidate_items:
            url = item["url"]
            if not await storage.is_news_url_processed(url):
                new_items.append(item)

        # Remove in-memory duplicate URLs
        seen_urls = set()
        unique_new_items = []
        for item in new_items:
            if item["url"] not in seen_urls:
                seen_urls.add(item["url"])
                unique_new_items.append(item)

        logger.info(f"[GlobalNewsPlugin] New unique candidate items to evaluate: {len(unique_new_items)}")
        if not unique_new_items:
            logger.info("[GlobalNewsPlugin] All collected news items are already up to date.")
            return [], []

        # 3. Batch Curation via Gemma / Gemini Flash
        batch_size = 20
        adopted_news_items = []
        gemini_service = context.gemini_service

        for i in range(0, len(unique_new_items), batch_size):
            batch = unique_new_items[i : i + batch_size]
            curated_results = await gemini_service.curate_ai_news_batch(batch)

            for res in curated_results:
                idx = res.get("id")
                is_adopted = res.get("adopt", False)
                category = res.get("category", "General")

                if is_adopted and isinstance(idx, int) and 0 <= idx < len(batch):
                    orig_item = batch[idx]
                    adopted_news_items.append({
                        "title": orig_item["title"],
                        "url": orig_item["url"],
                        "source_name": orig_item["source"],
                        "category": category if category != "None" else "General",
                        "published_at": orig_item["published_at"],
                    })

        logger.info(f"[GlobalNewsPlugin] Gemma Curation complete: {len(adopted_news_items)} items adopted out of {len(unique_new_items)}.")

        # 4. Save adopted items to Supabase
        if adopted_news_items:
            saved_count = await storage.save_ai_news_bulk(adopted_news_items)
            logger.info(f"[GlobalNewsPlugin] Persisted {saved_count} curated news items into `ai_news` table.")

        return [], adopted_news_items
