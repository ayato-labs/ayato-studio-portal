from unittest.mock import AsyncMock, patch

import pytest

from core.utils.content_extractor import ContentExtractor


@pytest.mark.asyncio
async def test_extract_rss_body_html():
    """Verify HTML extraction from a mocked RSS article URL."""
    mock_html = """
    <html>
        <body>
            <article>
                <h1>Test Article</h1>
                <p>This is the first paragraph with more than 20 characters.</p>
                <p>Short.</p>
                <p>This is the second significant paragraph that should be extracted correctly by our engine.</p>
            </article>
            <nav>Noise link</nav>
        </body>
    </html>
    """

    with patch(
        "core.utils.fetch_util.FetchUtil.safe_fetch_url", new_callable=AsyncMock
    ) as mock_fetch:
        mock_fetch.return_value = mock_html

        result = await ContentExtractor.extract_full_text("https://example.com/news/1")

        assert "This is the first paragraph" in result
        assert "This is the second significant paragraph" in result
        assert "Noise link" not in result
        assert "Short." not in result  # Because it's < 20 chars


@pytest.mark.asyncio
async def test_extract_arxiv_pdf_mocked():
    """Verify PDF extraction logic by mocking the pdfminer library call."""
    mock_pdf_bytes = b"%PDF-1.4"  # Dummy PDF header
    mock_extracted_text = (
        "Abstract: This is a breakthrough in AI research.\nIntroduction: We present a new model."
    )

    with patch(
        "core.utils.fetch_util.FetchUtil.safe_fetch_url", new_callable=AsyncMock
    ) as mock_fetch:
        mock_fetch.return_value = mock_pdf_bytes

        with patch("core.utils.content_extractor.extract_text") as mock_extract:
            mock_extract.return_value = mock_extracted_text

            result = await ContentExtractor.extract_full_text("https://arxiv.org/pdf/2403.12345v1")

            assert "breakthrough in AI research" in result
            assert "Introduction" in result
            mock_extract.assert_called_once()


@pytest.mark.asyncio
async def test_extract_full_text_error_handling():
    """Verify that the extractor returns an empty string on network or parse failure."""
    with patch(
        "core.utils.fetch_util.FetchUtil.safe_fetch_url", new_callable=AsyncMock
    ) as mock_fetch:
        mock_fetch.side_effect = Exception("Network Down")

        result = await ContentExtractor.extract_full_text("https://example.com/fail")
        assert result == ""
