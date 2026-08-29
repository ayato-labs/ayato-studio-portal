from unittest.mock import AsyncMock, MagicMock

import pytest

from core.engine import IntelligenceEngine
from core.service_container import ServiceContainer


@pytest.fixture
def chaos_container():
    container = MagicMock(spec=ServiceContainer)

    container.database = MagicMock()
    container.database.save_sns_log = AsyncMock()
    container.database.is_processed = AsyncMock(return_value=False)
    container.database.save_report = AsyncMock()
    container.database.delete_old_data = AsyncMock()

    container.plugin_manager = MagicMock()

    container.output_handler = MagicMock()
    container.output_handler.process_artifacts = AsyncMock()

    container.metrics_service = MagicMock()

    container.hatena_service = MagicMock()
    container.hatena_service.post_combined_digest = AsyncMock()

    container.github_service = MagicMock()
    container.github_service.trigger_portal_rebuild = AsyncMock()

    container.x_service = MagicMock()
    container.x_service.execute_top_posts = AsyncMock()

    container.bluesky_service = MagicMock()
    container.bluesky_service.execute_top_posts = AsyncMock()

    container.close_all = AsyncMock()

    return container


@pytest.mark.asyncio
async def test_engine_handles_storage_outage(chaos_container):
    """Chaos Test: Engine handles DB being down during log saving."""
    chaos_container.database.save_sns_log.side_effect = Exception("Supabase Down")

    engine = IntelligenceEngine(chaos_container)

    # Mocking plugin run to return some items
    mock_plugin = MagicMock()
    mock_plugin.run = AsyncMock(return_value=([], [{"id": "item1", "score": 90}]))

    plugin_id = "tech"
    chaos_container.plugin_manager.get_all_manifests.return_value = [{"id": plugin_id}]
    chaos_container.plugin_manager.load_plugin.return_value = lambda: mock_plugin

    # Should not crash engine
    await engine.execute(plugin_id=plugin_id)
    assert True
