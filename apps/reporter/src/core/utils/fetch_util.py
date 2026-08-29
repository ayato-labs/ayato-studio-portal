import asyncio
import logging
import urllib.error
import urllib.request

logger = logging.getLogger(__name__)


class FetchUtil:
    """
    Centralized utility for safe, concurrent I/O operations.
    Prevents burst-related ThreadPool exhaustion.
    """

    _semaphores: dict[asyncio.AbstractEventLoop, asyncio.Semaphore] = {}

    @classmethod
    async def _get_semaphore(cls) -> asyncio.Semaphore:
        loop = asyncio.get_running_loop()
        if loop not in cls._semaphores:
            cls._semaphores[loop] = asyncio.Semaphore(5)
        return cls._semaphores[loop]

    @classmethod
    async def safe_fetch_url(
        cls,
        url_or_req: str | urllib.request.Request,
        timeout: int = 20,
        max_retries: int = 3,
        backoff_factor: float = 2.0,
    ) -> bytes | None:
        """
        Safely fetch content from a URL using asyncio.to_thread with a Semaphore.
        Retries on HTTP 429 (Too Many Requests).
        Catches RuntimeError during event loop shutdown.
        """
        sem = await cls._get_semaphore()

        has_full_url = hasattr(url_or_req, "full_url")
        display_url = url_or_req.full_url if has_full_url else str(url_or_req)

        async with sem:

            def _do_fetch():
                import ssl

                context = ssl.create_default_context()
                # Some RSS servers might require this
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE

                # We do NOT catch exceptions here, let them bubble up to safe_fetch_url
                with urllib.request.urlopen(
                    url_or_req, timeout=timeout, context=context
                ) as response:
                    return response.read()

            for attempt in range(max_retries):
                try:
                    return await asyncio.to_thread(_do_fetch)
                except urllib.error.HTTPError as e:
                    if e.code == 429 and attempt < max_retries - 1:
                        wait_time = backoff_factor * (2**attempt)
                        logger.warning(
                            f"[FetchUtil] 429 Too Many Requests for {display_url}. Retrying in {wait_time}s... (Attempt {attempt + 1}/{max_retries})"
                        )
                        await asyncio.sleep(wait_time)
                        continue

                    logger.error(f"[FetchUtil] HTTP Error {e.code} for {display_url}: {e}")
                    return None
                except RuntimeError as e:
                    if "after shutdown" in str(e):
                        logger.warning(f"[FetchUtil] Shutdown detected. Aborting: {display_url}.")
                    else:
                        logger.error(f"[FetchUtil] Unexpected RuntimeError: {e}")
                    return None
                except Exception as e:
                    logger.error(f"[FetchUtil] Fetch Error for {display_url}: {e}")
                    return None

            return None
