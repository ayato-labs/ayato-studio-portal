import asyncio
import logging
import sys
import urllib.request

from config import settings
from core.utils.fetch_util import FetchUtil

# Setup minimal logging
from core.utils.logger import LogManager

LogManager.setup(level=logging.INFO)
logger = logging.getLogger("canary_fetch")

# Samples to verify (Finance, Energy, News mix)
CANARY_URLS = [
    "https://www.federalreserve.gov/feeds/press_all.xml",  # FRB (Stable)
    "https://news.google.com/rss/search?q=source:iea.org&hl=en-US&gl=US&ceid=US:en",  # IEA Proxy
    "https://www.eia.gov/rss/press_rss.xml",  # EIA Corrected
    "https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja",  # Google News JP
    "https://www.boj.or.jp/rss/whatsnew.xml",  # Bank of Japan (NEW)
    "https://mof-gov.note.jp/rss",  # MOF Note (NEW)
]


async def run_canary():
    logger.info("Starting Canary-Fetch Connectivity Check...")
    success_count = 0
    fail_count = 0

    # Wrap in Request to include standard User-Agent/Headers from settings
    tasks = [
        FetchUtil.safe_fetch_url(
            urllib.request.Request(url, headers=settings.DEFAULT_HEADERS), timeout=15
        )
        for url in CANARY_URLS
    ]
    results = await asyncio.gather(*tasks)

    for url, result in zip(CANARY_URLS, results, strict=False):
        if result:
            logger.info(f"[PASS] {url}")
            success_count += 1
        else:
            logger.error(f"[FAIL] {url}")
            fail_count += 1

    logger.info(f"Summary: {success_count} passed, {fail_count} failed.")

    if fail_count > 0:
        logger.error("Canary-Fetch Failed! Some critical feeds are unreachable.")
        sys.exit(1)
    else:
        logger.info("Canary-Fetch Successful.")
        sys.exit(0)


if __name__ == "__main__":
    try:
        asyncio.run(run_canary())
    except KeyboardInterrupt:
        pass
    except Exception as e:
        logger.critical(f"Unhandled Exception in Canary-Fetch: {e}")
        sys.exit(1)
