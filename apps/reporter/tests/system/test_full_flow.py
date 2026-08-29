from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from core.service_container import ServiceContainer


@pytest.mark.asyncio
async def test_full_system_execution_simulation():
    """Verify the full execution flow using the actual TechPlugin logic but mocked services."""
    container = ServiceContainer()
    container._database = AsyncMock()
    container._gemini_service = MagicMock()
    container._database.is_processed.return_value = False

    # Mock scoring and report generation
    container._gemini_service.call_structured_async = AsyncMock(
        return_value={"score": 80, "reason": "System Test"}
    )
    container._gemini_service.generate_report_async = AsyncMock(return_value="# Full System Report")
    container._gemini_service.generate_title_async = AsyncMock(return_value="Full System Title")

    with (
        patch("plugins.tech.main.AffiliateManager", new_callable=AsyncMock) as mock_aff,
        patch("plugins.tech.main.DisclaimerManager") as mock_disc,
    ):
        mock_aff.inject_async = AsyncMock(return_value="# Affiliated Content")
        mock_disc.inject = MagicMock(return_value="# Affiliated & Disclaimer Content")

        from plugins.tech.main import Plugin as TechPlugin

        plugin = TechPlugin()

        # Mock articles to discover
        plugin.fetcher.fetch_arxiv = AsyncMock(
            return_value=[
                {
                    "id": "sys_test_1",
                    "title": "System Test Article",
                    "summary": "Full flow test.",
                    "url": "http://test.com",
                    "published": "2024-01-01",
                    "source": "test",
                    "market": "tech",
                }
            ]
        )
        with patch(
            "plugins.tech.main.ContentExtractor.extract_full_text", new_callable=AsyncMock
        ) as mock_extract:
            mock_extract.return_value = "System Test Full Content"
            artifacts, items = await plugin.run(container)

        assert len(artifacts) > 0
        assert container._database.save_item.called
        assert container._database.save_ai_score.called
