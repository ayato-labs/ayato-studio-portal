import asyncio
import logging
import urllib.request
import xml.etree.ElementTree as ET

# Configure basic logging to stdout
from core.utils.logger import LogManager

LogManager.setup(level=logging.INFO)
logger = logging.getLogger("FeedValidator")

FEEDS = {
    "LangChain Blog": "https://blog.langchain.dev/rss/",
    "NVIDIA Developer Blog": "https://developer.nvidia.com/blog/feed/",
    "ITmedia AI+": "https://rss.itmedia.co.jp/rss/2.0/aiplus.xml",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}


async def validate_feed(name, url):
    logger.info(f"--- Validating {name} ---")
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status != 200:
                logger.error(f"  [FAIL] HTTP Status: {response.status}")
                return False

            content = response.read()
            logger.info(f"  [OK] Successfully fetched {len(content)} bytes.")

            # Basic XML parsing check
            root = ET.fromstring(content)

            # Detect RSS vs Atom
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            items = root.findall(".//item") or root.findall(".//atom:entry", ns)

            if not items:
                logger.error("  [FAIL] No items/entries found in XML.")
                return False

            # Try to extract the first title
            first_item = items[0]
            title_node = first_item.find("title") or first_item.find("atom:title", ns)
            title = title_node.text if title_node is not None else "N/A"

            logger.info(f"  [SUCCESS] Found {len(items)} items. Latest: {title}")
            return True

    except Exception as e:
        logger.error(f"  [ERROR] {e}")
        return False


async def main():
    success_count = 0
    for name, url in FEEDS.items():
        if await validate_feed(name, url):
            success_count += 1

    logger.info("\n--- FINAL SUMMARY ---")
    logger.info(f"Total: {len(FEEDS)}, Success: {success_count}")
    if success_count == len(FEEDS):
        logger.info("ALL FEEDS VALIDATED SUCCESSFULLY.")
    else:
        logger.info(f"SOME FEEDS FAILED VALIDATION ({len(FEEDS) - success_count} failures).")


if __name__ == "__main__":
    asyncio.run(main())
