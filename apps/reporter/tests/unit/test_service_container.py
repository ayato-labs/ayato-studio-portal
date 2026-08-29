from unittest.mock import patch

from core.service_container import ServiceContainer


def test_service_container_exposes_services():
    """Verify that all expected services are correctly exposed by the container."""
    # Patch constructors to avoid real initialization which requires API keys
    with (
        patch("core.storage.supabase_storage.SupabaseStorage"),
        patch("core.services.gemini.GeminiService"),
        patch("core.output_handler.OutputHandler"),
        patch("core.services.x_platform.XService"),
        patch("core.services.bluesky_platform.BlueskyService"),
        patch("core.services.metrics_service.MetricsService"),
        patch("core.services.hatena_blog.HatenaBlogService"),
    ):
        container = ServiceContainer()

        # Check if all targeted services are accessible
        assert container.database is not None
        assert container.gemini_service is not None
        assert container.output_handler is not None
        assert container.x_service is not None
        assert container.bluesky_service is not None
        assert container.metrics_service is not None
        assert container.hatena_service is not None

        # Verify the specific fix for the previous bug
        assert hasattr(container, "output_handler")


def test_service_container_lazy_loading():
    """Verify that services are not initialized until accessed."""
    container = ServiceContainer()
    assert container._database is None
    assert container._gemini_service is None

    # Trigger lazy loading but mock the actual initialization
    with patch("core.storage.supabase_storage.SupabaseStorage"):
        _ = container.database
        assert container._database is not None
