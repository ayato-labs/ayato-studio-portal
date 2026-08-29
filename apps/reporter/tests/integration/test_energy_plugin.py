from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from core.service_container import ServiceContainer
from plugins.energy.main import Plugin


@pytest.fixture
def mock_container():
    container = ServiceContainer()
    container._gemini_service = MagicMock()
    container._database = AsyncMock()
    container._database.is_processed.return_value = False
    return container


@pytest.mark.asyncio
async def test_energy_plugin_flow(mock_container):
    """Verify that EnergyPlugin discovers and enriches specialized energy sector news."""
    mock_gemini = mock_container._gemini_service
    mock_gemini.call_structured_async = AsyncMock(
        return_value={"score": 82, "reason": "Structural change in LNG"}
    )
    mock_gemini.generate_report_async = AsyncMock(return_value="# Energy Sector Analysis")
    mock_gemini.generate_title_async = AsyncMock(return_value="Dynamic Energy Title")

    # Mock the fetcher for energy news
    plugin = Plugin()
    # Logic in energy/main.py calls fetch_rss()
    plugin.fetcher.fetch_rss = AsyncMock(
        return_value=[
            {
                "id": "e1",
                "title": "IEA Outlook",
                "summary": "LNG and Nuclear in 2026",
                "url": "http://iea.org/e1",
                "published": "2026-04-03T10:00:00Z",
                "source": "energy",
                "market": "energy",
            }
        ]
    )

    with (
        patch(
            "plugins.energy.main.ContentExtractor.extract_full_text", new_callable=AsyncMock
        ) as mock_extract,
        patch(
            "plugins.energy.main.AffiliateManager.inject_async", new_callable=AsyncMock
        ) as mock_inject,
        patch("plugins.energy.main.DisclaimerManager.inject") as mock_disc,
    ):
        mock_extract.return_value = "Full article content for energy enrichment."
        mock_inject.return_value = "Enriched Content with Ad"
        mock_disc.return_value = "Enriched Content with Ad and Disclaimer"

        artifacts, items = await plugin.run(mock_container)

        assert len(artifacts) > 0
        assert items[0]["full_content"] == "Full article content for energy enrichment."
        assert mock_gemini.call_structured_async.called
        assert mock_container._database.save_item.called
