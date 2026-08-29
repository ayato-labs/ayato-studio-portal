from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest

from core.interfaces.plugin import ReportArtifact
from core.services.hatena_blog import HatenaBlogService


@pytest.mark.asyncio
async def test_post_combined_digest_success():
    """Verify successful combined digest post to Hatena Blog using mocked httpx."""
    mock_response = MagicMock(spec=httpx.Response)
    mock_response.status_code = 201
    mock_response.text = "Created"

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response

        service = HatenaBlogService()
        # Mock settings to avoid skipping
        with patch("core.services.hatena_blog.settings") as mock_settings:
            mock_settings.HATENA_USER_ID = "test_user"
            mock_settings.HATENA_API_KEY = "test_key"
            mock_settings.HATENA_TECH_BLOG_ID = "test_blog"
            mock_settings.PORTAL_BASE_URL = "https://portal.com"

            artifact = ReportArtifact(
                title="T1", content="C1", filename="f1.html", category="Tech", market="tech"
            )
            mock_gemini = MagicMock()
            mock_gemini.generate_report_async = AsyncMock(
                return_value="# TITLE: DIGEST TITLE\nDigest Content"
            )

            await service.post_combined_digest([artifact], mock_gemini)

            assert mock_post.called
            # Check if title was passed correctly inside the Atom XML
            _, kwargs = mock_post.call_args
            content = kwargs.get("content", b"").decode("utf-8")
            assert "<title>DIGEST TITLE</title>" in content
            assert 'type="text/html"' in content
            assert "&lt;p&gt;Digest Content&lt;/p&gt;" in content
            assert 'href="https://portal.com/reports/tech/f1.html"' in content


@pytest.mark.asyncio
async def test_post_combined_digest_skipped_missing_credentials():
    """Verify that posting is skipped if credentials are not configured."""
    with patch("core.services.hatena_blog.settings") as mock_settings:
        mock_settings.HATENA_USER_ID = ""
        mock_settings.HATENA_API_KEY = "test_key"

        service = HatenaBlogService()

        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            await service.post_combined_digest([], MagicMock())
            assert not mock_post.called


@pytest.mark.asyncio
async def test_post_combined_digest_error_handling():
    """Verify that exceptions in the posting process are caught and logged."""
    service = HatenaBlogService()
    with patch("core.services.hatena_blog.settings") as mock_settings:
        mock_settings.HATENA_USER_ID = "test_user"
        mock_settings.HATENA_API_KEY = "test_key"
        mock_settings.HATENA_TECH_BLOG_ID = "test_blog"

        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.side_effect = Exception("Hatena Down")

            artifact = ReportArtifact(
                title="T1", content="C1", filename="f1.html", category="Tech", market="tech"
            )
            mock_gemini = MagicMock()
            mock_gemini.generate_report_async = AsyncMock(return_value="# TITLE: T\nC")

            # Should not raise exception
            await service.post_combined_digest([artifact], mock_gemini)
            assert mock_post.called
