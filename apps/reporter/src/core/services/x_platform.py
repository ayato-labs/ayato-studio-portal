import asyncio
import logging

import tweepy

from config import settings
from core.utils.url_util import generate_portal_url

logger = logging.getLogger(__name__)


class XService:
    def __init__(self, gemini_service, database):
        self.gemini_service = gemini_service
        self.database = database

        # Initialize Tweepy Client (V2)
        creds = [
            settings.X_API_KEY,
            settings.X_API_SECRET,
            settings.X_ACCESS_TOKEN,
            settings.X_ACCESS_TOKEN_SECRET,
        ]
        if all(creds):
            self.client = tweepy.Client(
                consumer_key=settings.X_API_KEY,
                consumer_secret=settings.X_API_SECRET,
                access_token=settings.X_ACCESS_TOKEN,
                access_token_secret=settings.X_ACCESS_TOKEN_SECRET,
            )
            logger.info("[XService] Tweepy Client initialized")
        else:
            self.client = None
            logger.warning("[XService] Missing X API credentials. Posting will be skipped.")

    async def execute_top_posts(self, items: list[dict] = None, limit=3):
        """Processes provided items and posts them to X."""
        if not self.client:
            logger.warning("[XService] Posting skipped: Client not initialized.")
            return False

        if not items:
            logger.info("[XService] No items provided for X posting.")
            return True

        # Filter by threshold and limit
        # In stateless mode, we only post items from current run
        candidates = [it for it in items if it.get("score", 0) >= settings.X_POST_THRESHOLD]
        candidates = candidates[:limit]

        if not candidates:
            logger.info(f"[XService] No items met threshold ({settings.X_POST_THRESHOLD}) for X.")
            return True

        logger.info(f"[XService] Attempting to post {len(candidates)} items to X...")
        for item in candidates:
            success = await self._post_item(item)
            if success:
                logger.info(f"[XService] Successfully posted item {item.get('id')} to X.")
            else:
                logger.error(f"[XService] Failed to post item {item.get('id')} to X.")

        return True

    async def _post_item(self, item: dict) -> bool:
        """Posts a single item to X with AI summarization and auditing."""
        try:
            # --- AI Summarization Phase ---
            prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "sns_post_v1.txt")
            if not prompt_tpl:
                # Fallback
                prompt = f"Summarize this for X (catchy, JP): {item['title']}\n{item['summary']}"
            else:
                full_content_hint = ""
                if "full_content" in item:
                    full_content_hint = f"Full Content Snapshot: {item['full_content'][:1000]}"

                prompt = prompt_tpl.format(
                    title=item["title"],
                    category=item.get("category", "Tech"),
                    summary=item["summary"],
                    full_content_hint=full_content_hint,
                )

            ai_text = await self.gemini_service.generate_report_async(prompt, tier="heavy")
            ai_text = ai_text.strip().strip('"')

            # Final assembly (X URL count is 23, Redirect to portal)
            url = generate_portal_url(item.get("id"))
            tweet_text = f"{ai_text}\n\n{url}"

            # Safety Truncation for X (280 chars)
            if len(tweet_text) > 275:
                tweet_text = tweet_text[:272] + "..."

            if not self.client:
                return False

            # Post via V2 API (non-blocking)
            await asyncio.to_thread(self.client.create_tweet, text=tweet_text)

            # Audit Logging
            await self.database.save_sns_log(
                platform="x",
                content=tweet_text,
                item_id=item.get("id"),
                model=settings.AI_MODEL_HEAVY_TASK[0],
                status="success",
            )

            return True

        except Exception as e:
            error_msg = str(e)
            is_quota_error = "402" in error_msg or "Payment Required" in error_msg

            if is_quota_error:
                logger.warning(f"[XService] X API Quota Exhausted (402): {error_msg}")
            else:
                logger.error(f"[XService] Error posting {item.get('url')} to X: {e}")

            try:
                await self.database.save_sns_log(
                    platform="x",
                    content=f"ERROR: {error_msg}",
                    item_id=item.get("id"),
                    model=settings.AI_MODEL_HEAVY_TASK[0],
                    status="quota_limit" if is_quota_error else "failed",
                )
            except Exception as e:
                logger.error(f"[XService] Failed to save SNS log to database: {e}")
            return False
