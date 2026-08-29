import asyncio
import logging

from google import genai

from config import settings

logger = logging.getLogger(__name__)


class PreflightValidator:
    """Validates critical infrastructure connectivity at startup."""

    @staticmethod
    async def check_google_ai(api_key: str) -> bool:
        """Checks if Google GenAI API key is valid."""
        try:
            client = genai.Client(api_key=api_key)
            # List models is a lightweight way to check if the key is valid
            client.models.list(config={"page_size": 1})
            logger.info("[Preflight] Google AI: Connection Verified.")
            return True
        except Exception as e:
            logger.error(f"[Preflight] Google AI: Connection Failed: {e}")
            return False

    @staticmethod
    async def check_supabase(storage) -> bool:
        """Checks if Supabase API key and URL are valid."""
        if not storage:
            logger.error("[Preflight] Supabase: Storage instance not provided.")
            return False

        success = await storage.test_connection()
        if success:
            logger.info("[Preflight] Supabase: Connection Verified.")
        else:
            logger.error("[Preflight] Supabase: Connection Failed (Check URL/Key/Project).")
        return success

    @staticmethod
    async def check_supabase_tables(storage) -> bool:
        """Checks if required Supabase tables exist."""
        required_tables = ["raw_items", "ai_scores", "generated_reports"]
        optional_tables = ["sns_post_logs"]

        all_ok = True
        for table in required_tables:
            try:
                # Query with limit 0 to just check existence
                await storage._request("GET", table, params={"limit": "0"})
            except Exception as e:
                logger.error(f"[Preflight] Supabase Table Missing/Error: {table} ({e})")
                all_ok = False

        for table in optional_tables:
            try:
                await storage._request("GET", table, params={"limit": "0"})
            except Exception:
                logger.warning(
                    f"[Preflight] Supabase Optional Table Missing: {table}. (Posting logs will be skipped)"
                )

        return all_ok

    @classmethod
    async def run_all(cls, container) -> bool:
        """Runs all critical pre-flight checks."""
        logger.info("[Preflight] Starting infrastructure validation...")

        google_task = cls.check_google_ai(settings.GOOGLE_API_KEY)
        supabase_task = cls.check_supabase(container.database)

        results = await asyncio.gather(google_task, supabase_task)

        if not all(results):
            logger.critical(
                "[Preflight] !!! VALIDATION FAILED !!! Connection to core services failed."
            )
            return False

        # If connections are OK, check schema
        schema_ok = await cls.check_supabase_tables(container.database)
        if not schema_ok:
            logger.critical(
                "[Preflight] !!! SCHEMA VALIDATION FAILED !!! One or more required tables are missing."
            )
            return False

        logger.info("[Preflight] ALL CHECKS PASSED. Ready to engage.")
        return True
