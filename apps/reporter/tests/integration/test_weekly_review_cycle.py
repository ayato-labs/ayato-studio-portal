from datetime import datetime
from unittest.mock import AsyncMock, patch

import pytest

from core.service_container import ServiceContainer
from plugins.weekly_review.main import Plugin


@pytest.fixture
def mock_container():
    container = ServiceContainer()
    container._database = AsyncMock()
    container._gemini_service = AsyncMock()
    return container


@pytest.mark.asyncio
async def test_weekly_review_skips_on_wrong_day(mock_container):
    """Verify that WeeklyReview skips execution on days not divisible by 5."""
    # Mock datetime.now() to return the 4th (not divisible by 5)
    mock_now = datetime(2026, 4, 4, 15, 0)  # 4th day, 3 PM

    with patch("plugins.weekly_review.main.datetime") as mock_datetime:
        mock_datetime.now.return_value = mock_now

        plugin = Plugin()
        artifacts, items = await plugin.run(mock_container)

        assert artifacts == []
        assert items == []
        assert not mock_container._database.fetch_recent_reports.called


@pytest.mark.asyncio
async def test_weekly_review_skips_on_morning(mock_container):
    """Verify that WeeklyReview skips execution in the morning even if day is divisible by 5."""
    # Mock datetime.now() to return the 5th at 4 AM (divisible by 5, but morning)
    mock_now = datetime(2026, 4, 5, 4, 0)

    with patch("plugins.weekly_review.main.datetime") as mock_datetime:
        mock_datetime.now.return_value = mock_now

        plugin = Plugin()
        artifacts, items = await plugin.run(mock_container)

        assert artifacts == []
        mock_container._database.fetch_recent_reports.assert_not_called()


@pytest.mark.asyncio
async def test_weekly_review_runs_on_5th_afternoon(mock_container):
    """Verify that WeeklyReview executes on the 5th day in the afternoon."""
    # Mock datetime.now() to return the 5th at 8 PM (divisible by 5, and PM)
    mock_now = datetime(2026, 4, 5, 20, 0)

    # Mock database to return some reports
    mock_container._database.fetch_recent_reports.return_value = [
        {
            "title": "Report 1",
            "content_md": "Content 1",
            "category": "Tech",
            "market": "tech",
            "generated_at": "2026-04-05T00:00:00Z",
        }
    ]

    # Mock AI response
    mock_container._gemini_service.generate_report_async.return_value = "# Weekly Column"

    with patch("plugins.weekly_review.main.datetime") as mock_datetime:
        mock_datetime.now.return_value = mock_now
        # Also need to patch it for the Plugin's init or run_id if needed
        # Actually Plugin.__init__ calls datetime.now().

        plugin = Plugin()
        artifacts, items = await plugin.run(mock_container)

        assert len(artifacts) > 0
        assert mock_container._database.fetch_recent_reports.called
        # Check if it requested 5 days
        args, kwargs = mock_container._database.fetch_recent_reports.call_args
        assert kwargs["days"] == 5
