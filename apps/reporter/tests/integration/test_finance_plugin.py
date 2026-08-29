from unittest.mock import AsyncMock, patch

import pytest

from core.service_container import ServiceContainer
from plugins.finance.main import Plugin


@pytest.fixture
def mock_container():
    container = ServiceContainer()
    container._gemini_service = AsyncMock()
    container._database = AsyncMock()
    container._database.is_processed.return_value = False
    return container


@pytest.mark.asyncio
async def test_finance_plugin_flow(mock_container):
    """Verify that FinancePlugin discovers, scores, and enriches macro news."""
    mock_gemini = mock_container._gemini_service
    mock_gemini.call_structured_async = AsyncMock(
        return_value={"score": 88, "reason": "High impact"}
    )
    mock_gemini.generate_report_async = AsyncMock(return_value="# Finance Report")
    mock_gemini.generate_title_async = AsyncMock(return_value="Dynamic Finance Title")

    # Mock the fetcher for finance news
    plugin = Plugin()
    plugin.fetcher.fetch_rss = AsyncMock(
        return_value=[
            {
                "id": "f1",
                "title": "Macro Update",
                "summary": "Impact on rates.",
                "url": "http://example.com/f1",
                "published": "2026-04-03T09:00:00Z",
                "source": "finance",
                "market": "finance",
            }
        ]
    )

    with (
        patch(
            "plugins.finance.main.ContentExtractor.extract_full_text",
            new_callable=AsyncMock,
        ) as mock_extract,
        patch(
            "plugins.finance.main.AffiliateManager.inject_async",
            new_callable=AsyncMock,
        ) as mock_inject,
        patch("plugins.finance.main.DisclaimerManager.inject") as mock_disc,
    ):
        mock_extract.return_value = "Full article content for finance enrichment."
        mock_inject.return_value = "Enriched Content with Ad"
        mock_disc.return_value = "Enriched Content with Ad and Disclaimer"

        artifacts, items = await plugin.run(mock_container)

        assert len(artifacts) > 0
        assert items[0]["full_content"] == "Full article content for finance enrichment."
        assert mock_gemini.call_structured_async.called
        assert mock_container._database.save_item.called
