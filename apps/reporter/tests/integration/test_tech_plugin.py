from datetime import datetime
from unittest.mock import AsyncMock, patch

import pytest

from core.service_container import ServiceContainer
from plugins.tech.main import Plugin


@pytest.fixture
def mock_container():
    container = ServiceContainer()
    # Use AsyncMock for core services
    container._gemini_service = AsyncMock()
    container._database = AsyncMock()
    container._database.is_processed = AsyncMock(return_value=False)
    container._database.save_item = AsyncMock()
    container._database.save_ai_score = AsyncMock()
    container._database.save_report = AsyncMock()
    return container


@pytest.mark.asyncio
async def test_tech_plugin_flow(mock_container):
    """Verify the discovery-to-scoring flow of the TechPlugin."""
    mock_gemini = mock_container._gemini_service
    mock_gemini.call_structured_async = AsyncMock(
        return_value={"score": 85, "reason": "Interesting"}
    )
    mock_gemini.generate_report_async = AsyncMock(return_value="# Full Report Content")
    mock_gemini.generate_title_async = AsyncMock(return_value="Tech Title")

    with (
        patch(
            "plugins.tech.main.AffiliateManager.inject_async", new_callable=AsyncMock
        ) as mock_inject,
        patch("plugins.tech.main.DisclaimerManager.inject") as mock_disc,
    ):
        mock_inject.return_value = "# Affiliated Content"
        mock_disc.return_value = "# Affiliated & Disclaimer Content"

        plugin = Plugin()
        now_str = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        plugin.fetcher.fetch_arxiv = AsyncMock(
            return_value=[
                {
                    "id": "item1",
                    "title": "AI Breakout",
                    "summary": "Big news",
                    "url": "http://example.com/1",
                    "published": now_str,
                    "source": "arxiv",
                    "market": "tech",
                }
            ]
        )
        plugin.fetcher.fetch_rss = AsyncMock(return_value=[])

        with patch(
            "plugins.tech.main.ContentExtractor.extract_full_text", new_callable=AsyncMock
        ) as mock_extract:
            mock_extract.return_value = "Full article content for enrichment."
            artifacts, enriched = await plugin.run(mock_container)

    # 1 report generated (consisting of 1 Japanese artifact)
    assert len(artifacts) == 1
    assert enriched[0]["full_content"] == "Full article content for enrichment."
    assert mock_gemini.call_structured_async.called
    assert mock_container._database.save_item.called


@pytest.mark.asyncio
async def test_tech_plugin_error_resilience(mock_container):
    """Verify that TechPlugin survives partial AI failures and filters low scores."""
    mock_gemini = mock_container._gemini_service

    async def side_effect(prompt, response_schema=None, tier=None):
        if "SuccessItem" in prompt:
            return {"score": 90, "reason": "High quality"}
        if "LowScoreItem" in prompt:
            return {"score": 30, "reason": "Irrelevant"}
        if "ErrorItem" in prompt:
            raise RuntimeError("AI Service Down for this item")
        return {"score": 0, "reason": "Unknown"}

    mock_gemini.call_structured_async = AsyncMock(side_effect=side_effect)
    mock_gemini.generate_report_async = AsyncMock(return_value="# Success Report")
    mock_gemini.generate_title_async = AsyncMock(return_value="Tech Title Error Res")

    with (
        patch(
            "plugins.tech.main.AffiliateManager.inject_async", new_callable=AsyncMock
        ) as mock_inject,
        patch("plugins.tech.main.DisclaimerManager.inject") as mock_disc,
    ):
        mock_inject.return_value = "# Affiliated Content"
        mock_disc.return_value = "# Affiliated & Disclaimer Content"

        plugin = Plugin()
        now_str = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")

        # 3 mixed items
        plugin.fetcher.fetch_arxiv = AsyncMock(
            return_value=[
                {
                    "id": "a1",
                    "title": "SuccessItem",
                    "summary": "Good",
                    "url": "u1",
                    "published": now_str,
                    "source": "arxiv",
                    "market": "tech",
                },
                {
                    "id": "a2",
                    "title": "ErrorItem",
                    "summary": "Bad AI",
                    "url": "u2",
                    "published": now_str,
                    "source": "arxiv",
                    "market": "tech",
                },
            ]
        )
        plugin.fetcher.fetch_rss = AsyncMock(
            return_value=[
                {
                    "id": "r1",
                    "title": "LowScoreItem",
                    "summary": "Boring",
                    "url": "u3",
                    "published": now_str,
                    "source": "rss",
                    "market": "tech",
                }
            ]
        )

        with patch(
            "plugins.tech.main.ContentExtractor.extract_full_text", new_callable=AsyncMock
        ) as mock_extract:
            mock_extract.return_value = "Success content"
            artifacts, enriched = await plugin.run(mock_container)

    # Generated reports for the batch of items (1 Japanese artifact).
    assert len(artifacts) == 1
    assert mock_container._database.save_item.called
