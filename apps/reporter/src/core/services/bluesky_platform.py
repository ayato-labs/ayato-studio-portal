import logging

from atproto import AsyncClient, AsyncRequest
from httpx import Timeout

from config import settings
from core.utils.url_util import generate_portal_url

logger = logging.getLogger(__name__)


class BlueskyService:
    """Handles interaction with the Bluesky Social platform."""

    def __init__(self, gemini_service, database):
        self.gemini_service = gemini_service
        self.database = database
        # Configure timeout: 5s connect, 10s read/write/pool
        timeout = Timeout(10.0, connect=5.0)
        request = AsyncRequest(timeout=timeout)
        self.client = AsyncClient(request=request)
        self.is_logged_in = False

    async def _ensure_logged_in(self):
        """Ensures the client is logged in asynchronously."""
        if self.is_logged_in:
            return True

        if not (settings.BLUESKY_HANDLE and settings.BLUESKY_APP_PASSWORD):
            logger.warning("[BlueskyService] Missing Bluesky credentials. Skipping.")
            return False

        try:
            try:
                await self.client.login(settings.BLUESKY_HANDLE, settings.BLUESKY_APP_PASSWORD)
                logger.info(f"[BlueskyService] Logged in as {settings.BLUESKY_HANDLE}")
            except Exception as e:
                logger.warning(
                    f"[BlueskyService] Primary login failed ({settings.BLUESKY_HANDLE}): {e}. Trying fallback."
                )
                await self.client.login(
                    settings.BLUESKY_HANDLE_FALLBACK,
                    settings.BLUESKY_APP_PASSWORD,
                )
                logger.info(f"[BlueskyService] Logged in as {settings.BLUESKY_HANDLE_FALLBACK}")

            self.is_logged_in = True
            return True
        except Exception as e:
            logger.error(f"[BlueskyService] Both primary and fallback login failed: {e}")
            return False

    async def execute_top_posts(self, items: list[dict] = None, limit=3):
        """Processes provided items and posts them to Bluesky."""
        if not await self._ensure_logged_in():
            return False

        if not items:
            logger.debug("[BlueskyService] No items to post.")
            return True

        # Filter by threshold and limit
        # In stateless mode, we only post items from current run
        candidates = [it for it in items if it.get("score", 0) >= settings.BLUESKY_POST_THRESHOLD]
        candidates = candidates[:limit]

        if not candidates:
            logger.info(
                f"[BlueskyService] No items met threshold ({settings.BLUESKY_POST_THRESHOLD}) for Bluesky."
            )
            return True

        logger.info(
            f"[BlueskyService] Attempting to AI-summarize and post {len(candidates)} items..."
        )
        for item in candidates:
            success = await self._post_item(item)
            if success:
                logger.info(
                    f"[BlueskyService] Successfully posted item {item.get('id')} to Bluesky."
                )
            else:
                logger.error(f"[BlueskyService] Failed to post item {item.get('id')} to Bluesky.")

        return True

    async def _post_item(self, item: dict) -> bool:
        """Helper to post a single item to the platform with AI summarization."""
        try:
            # --- AI Summarization Phase ---
            prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "sns_post_v1.txt")
            if not prompt_tpl:
                # Fallback if file missing
                prompt = (
                    f"Summarize this for BlueSky (catchy, JP): {item['title']}\n{item['summary']}"
                )
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

            # Final assembly (Redirect to portal)
            url = generate_portal_url(item.get("id"))
            final_text = f"{ai_text}\n\n{url}"

            # Bluesky text limits are roughly 300 characters
            if len(final_text) > 290:
                # Emergency truncation
                final_text = final_text[:287] + "..."

            # Posting via atproto client (became async)
            await self.client.send_post(text=final_text)

            # Audit Logging
            await self.database.save_sns_log(
                platform="bluesky",
                content=final_text,
                item_id=item.get("id"),
                model=settings.AI_MODEL_HEAVY_TASK[0],
                status="success",
            )

            return True

        except Exception as e:
            logger.error(f"[BlueskyService] Error posting {item.get('url')} to Bluesky: {e}")
            # Log failure to Supabase
            try:
                await self.database.save_sns_log(
                    platform="bluesky",
                    content=f"ERROR: {str(e)}",
                    item_id=item.get("id"),
                    model=settings.AI_MODEL_HEAVY_TASK[0],
                    status="failed",
                )
            except Exception:
                logging.error("[BlueskyService] Error logging to database.")
            return False
