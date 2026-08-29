from unittest.mock import AsyncMock, MagicMock

import pytest

from core.engine import IntelligenceEngine
from core.service_container import ServiceContainer


@pytest.mark.asyncio
async def test_engine_resilience_to_social_failure():
    """System Test: Engine should complete cycle even if social media posting fails."""
    from core.interfaces.plugin import ReportArtifact

    # Use real container but patch its attributes
    container = ServiceContainer()

    # Patch all properties
    container._storage = AsyncMock()
    container._storage.is_processed.return_value = False

    # Ensure database is mocked to return AsyncMocks for required methods
    container._database = MagicMock()
    container._database.save_report = AsyncMock()
    container._database.save_item = AsyncMock()
    container._database.is_processed = AsyncMock(return_value=False)
    container._database.delete_old_data = AsyncMock()

    container._x_service = MagicMock()
    container._x_service.execute_top_posts = AsyncMock(side_effect=Exception("X CRASH"))

    container._bluesky_service = MagicMock()
    container._bluesky_service.execute_top_posts = AsyncMock(side_effect=Exception("BSKY CRASH"))

    container._hatena_service = MagicMock()
    container._hatena_service.post_combined_digest = AsyncMock()

    container._github_service = MagicMock()
    container._github_service.trigger_portal_rebuild = AsyncMock()

    container._metrics_service = MagicMock()
    container._metrics_service.finalize_run = MagicMock()
    container._metrics_service.get_summary.return_value = "Mock Summary"

    # close_all needs to be async
    container.close_all = AsyncMock()

    # Mock plugin manager and output handler
    plugin_id = "tech"
    mock_pm = MagicMock()
    mock_pm.get_all_manifests.return_value = [{"id": plugin_id}]

    mock_plugin_inst = MagicMock()
    artifact = ReportArtifact(
        title="Chaos News", content="Content", filename="chaos.html", category="tech", market="tech"
    )
    scored_item = {"id": "chaos-1", "url": "http://chaos.com", "title": "Chaos News", "score": 100}
    mock_plugin_inst.run = AsyncMock(return_value=([artifact], [scored_item]))

    mock_pm.load_plugin.return_value = lambda: mock_plugin_inst

    mock_oh = MagicMock()
    mock_oh.process_artifacts = AsyncMock()

    container.plugin_manager = mock_pm
    container._output_handler = mock_oh

    engine = IntelligenceEngine(container)

    # Execute - should NOT raise exception
    await engine.execute(plugin_id=plugin_id)

    # Verify that later stages were still executed
    assert container.hatena_service.post_combined_digest.called
    assert container.github_service.trigger_portal_rebuild.called
    assert container.close_all.called
    print("SUCCESS: Engine survived social media crash and completed finalization.")
