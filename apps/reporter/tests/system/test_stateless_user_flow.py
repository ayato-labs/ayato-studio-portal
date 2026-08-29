from unittest.mock import AsyncMock, MagicMock

import pytest

from core.engine import IntelligenceEngine
from core.service_container import ServiceContainer


@pytest.fixture
def mock_container():
    container = MagicMock(spec=ServiceContainer)
    # Service properties should return mocks
    container.database = MagicMock()
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
async def test_stateless_execution_flow(mock_container):
    """System Test: Verify IntelligenceEngine.execute triggers all sub-phases."""
    engine = IntelligenceEngine(mock_container)

    # Mock plugin manager to return one fake plugin
    plugin_id = "test_plugin"
    mock_container.plugin_manager.get_all_manifests.return_value = [{"id": plugin_id}]

    mock_plugin = MagicMock()
    mock_plugin.run = AsyncMock(return_value=([], []))
    # Note: load_plugin returns the CLASS, which is then instantiated
    mock_container.plugin_manager.load_plugin.return_value = lambda: mock_plugin

    # Mock engine's own sub-methods if needed, but here we test the real orchestration
    await engine.execute(plugin_id=plugin_id)

    # Verify key steps were called
    assert mock_container.plugin_manager.load_plugin.called
    assert mock_plugin.run.called
    assert mock_container.database.delete_old_data.called
