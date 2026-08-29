from unittest.mock import MagicMock, patch

import pytest

from core.utils.fetch_util import FetchUtil


@pytest.mark.asyncio
async def test_fetch_util_broken_content():
    """Unit Test: FetchUtil handles 200 OK but broken data via read() failure."""
    with patch("urllib.request.urlopen") as mock_url:
        mock_response = MagicMock()
        mock_response.read.side_effect = Exception("Incomplete read error")
        mock_response.__enter__.return_value = mock_response
        mock_url.return_value = mock_response

        # Should return None and log error instead of crashing
        res = await FetchUtil.safe_fetch_url("http://broken-stream.com")
        assert res is None


@pytest.mark.asyncio
async def test_fetch_util_http_error_404():
    """Unit Test: FetchUtil handles 404 Not Found."""
    from urllib.error import HTTPError

    with patch("urllib.request.urlopen") as mock_url:
        mock_url.side_effect = HTTPError("http://404.com", 404, "Not Found", {}, None)

        res = await FetchUtil.safe_fetch_url("http://404.com")
        assert res is None


@pytest.mark.asyncio
async def test_fetch_util_timeout():
    """Unit Test: FetchUtil handles timeout."""
    with patch("urllib.request.urlopen") as mock_url:
        # socket.timeout is aliased to TimeoutError in Python 3.10+
        mock_url.side_effect = TimeoutError("The read operation timed out")

        res = await FetchUtil.safe_fetch_url("http://slow.com", timeout=1)
        assert res is None
