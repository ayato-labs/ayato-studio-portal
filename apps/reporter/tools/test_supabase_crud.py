import logging
import os

from dotenv import load_dotenv

from core.storage.supabase_storage import SupabaseStorage

# Configure logging
from core.utils.logger import LogManager

LogManager.setup(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_crud():
    """Verifies all main operations of the SDK-less SupabaseStorage."""
    load_dotenv()
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        logger.error("Missing SUPABASE_URL or SUPABASE_KEY")
        return

    logger.info("Starting SDK-less Supabase CRUD Test...")
    storage = SupabaseStorage(url, key)

    test_id = "test_item_9999"

    # 1. Test save_item (Upsert)
    try:
        logger.info(f"1. Testing save_item for {test_id}...")
        storage.save_item(
            test_id,
            source="test_source",
            title="Test Title - SDK-less",
            url="https://example.com/test",
            category="Test",
            market="test-market",
        )
        logger.info("[OK] save_item successful.")
    except Exception as e:
        logger.error(f"[FAIL] save_item failed: {e}")
        return

    # 2. Test is_processed (Select)
    try:
        logger.info(f"2. Testing is_processed for {test_id}...")
        processed = storage.is_processed(test_id)
        logger.info(f"[OK] is_processed returned: {processed}")
        if not processed:
            logger.error("[FAIL] is_processed should have been True.")
            return
    except Exception as e:
        logger.error(f"[FAIL] is_processed failed: {e}")
        return

    # 3. Test get_sns_candidates (Complex Select with Inner Join)
    try:
        logger.info("3. Testing get_sns_candidates...")
        # Note: This might return nothing if there's no AI score for the test item,
        # but the request itself should not fail.
        candidates = storage.get_sns_candidates(platform="bluesky", threshold=0, limit=1)
        logger.info(f"[OK] get_sns_candidates executed. Found {len(candidates)} candidates.")
    except Exception as e:
        logger.error(f"[FAIL] get_sns_candidates failed: {e}")
        return

    # 4. Test save_report (Upsert)
    try:
        logger.info(f"4. Testing save_report for {test_id}...")
        storage.save_report(
            test_id,
            language="jp",
            title="Generated Test Report",
            content_md="## Test MD Content",
            model_name="test-model",
            category="Test",
            market="test-market",
        )
        logger.info("[OK] save_report successful.")
    except Exception as e:
        logger.error(f"[FAIL] save_report failed: {e}")
        return

    # 5. Test mark_post_success (Patch)
    try:
        logger.info(f"5. Testing mark_post_success for {test_id}...")
        storage.mark_post_success(test_id, platform="bluesky")
        logger.info("[OK] mark_post_success successful.")
    except Exception as e:
        logger.error(f"[FAIL] mark_post_success failed: {e}")
        return

    logger.info("--- CRUD TEST COMPLETED SUCCESSFULLY ---")


if __name__ == "__main__":
    test_crud()
