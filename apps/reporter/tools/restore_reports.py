import asyncio
import logging
import os
import sys

# Add the root directory to sys.path
sys.path.append(os.getcwd())

from core.service_container import ServiceContainer
from core.utils.logger import LogManager

LogManager.setup(level=logging.INFO)
logger = logging.getLogger("RestoreDirect")


async def restore():
    container = ServiceContainer()
    database = container.database
    storage = database

    logger.info("Fetching raw items for direct restoration...")

    params = {
        "select": "id,title,summary,url,source,published_at,market,category",
        "order": "fetched_at.desc",
        "limit": "5",
    }

    try:
        resp = await storage._request("GET", "raw_items", params=params)
        items = resp.json()

        if not items:
            logger.error("No raw_items found. Cannot restore.")
            return

        logger.info(f"Restoring {len(items)} items directly to generated_reports...")

        for it in items:
            item_id = it["id"]
            title = f"[Restored] {it['title']}"
            # Simple content for now to verify pipeline
            content_md = f"## {title}\n\n{it['summary']}\n\nSource: {it['url']}"

            logger.info(f" -> Saving report for item: {item_id}")

            try:
                await database.save_report(
                    item_id=item_id,
                    language="jp",
                    title=title,
                    content_md=content_md,
                    model_name="direct_restoration_tool",
                    category=it.get("category", "News"),
                    market=it.get("market", "general"),
                )
                logger.info(f"    [OK] Saved {item_id}")
            except Exception as e:
                logger.error(f"    [FAIL] Failed to save {item_id}: {e}")

        logger.info("Direct restoration process completed.")

    except Exception as e:
        logger.exception(f"Restoration failed: {e}")


if __name__ == "__main__":
    asyncio.run(restore())
