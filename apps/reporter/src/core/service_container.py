import asyncio
import logging
from datetime import UTC, datetime

from config import settings

logger = logging.getLogger(__name__)


class ServiceContainer:
    """
    Ayato Intelligence Dependency Injection Container.
    Lazy-loads services to minimize memory footprint and initialization delay.
    """

    def __init__(self):
        self._database = None
        self._gemini_service = None
        self._hatena_service = None
        self._output_handler = None
        self._metrics_service = None
        self._compliance_validator = None
        self._x_service = None
        self._bluesky_service = None
        self._github_service = None
        self._plugin_manager = None

    @property
    def plugin_manager(self):
        """Lazy-loaded Plugin Manager."""
        if self._plugin_manager is None:
            import os

            from core.plugin_manager import PluginManager

            self._plugin_manager = PluginManager(os.path.join(os.getcwd(), "src", "plugins"))
            self._plugin_manager.discover()
        return self._plugin_manager

    @plugin_manager.setter
    def plugin_manager(self, value):
        self._plugin_manager = value

    @property
    def github_service(self):
        """Lazy-loaded GitHub automation service."""
        if self._github_service is None:
            from core.services.github_service import GithubService

            self._github_service = GithubService(settings.GITHUB_TOKEN)
        return self._github_service

    @property
    def database(self):
        """Lazy-loaded Supabase Storage service."""
        if self._database is None:
            from core.storage.supabase_storage import SupabaseStorage

            self._database = SupabaseStorage(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return self._database

    @database.setter
    def database(self, value):
        self._database = value

    @property
    def gemini_service(self):
        """Lazy-loaded Gemini AI service."""
        if self._gemini_service is None:
            from core.services.gemini import GeminiService

            self._gemini_service = GeminiService(settings.GOOGLE_API_KEY)
        return self._gemini_service

    @gemini_service.setter
    def gemini_service(self, value):
        self._gemini_service = value

    @property
    def x_service(self):
        """Lazy-loaded X (Twitter) posting service."""
        if self._x_service is None:
            from core.services.x_platform import XService

            self._x_service = XService(self.gemini_service, self.database)
        return self._x_service

    @x_service.setter
    def x_service(self, value):
        self._x_service = value

    @property
    def bluesky_service(self):
        """Lazy-loaded Bluesky posting service."""
        if self._bluesky_service is None:
            from core.services.bluesky_platform import BlueskyService

            self._bluesky_service = BlueskyService(self.gemini_service, self.database)
        return self._bluesky_service

    @bluesky_service.setter
    def bluesky_service(self, value):
        self._bluesky_service = value

    @property
    def metrics_service(self):
        """Lazy-loaded Metrics and Observability service."""
        if self._metrics_service is None:
            from core.services.metrics_service import MetricsService

            self._metrics_service = MetricsService()
        return self._metrics_service

    @property
    def hatena_service(self):
        """Lazy-loaded Hatena Blog service."""
        if self._hatena_service is None:
            from core.services.hatena_blog import HatenaBlogService

            self._hatena_service = HatenaBlogService()
        return self._hatena_service

    @hatena_service.setter
    def hatena_service(self, value):
        self._hatena_service = value

    @property
    def compliance_validator(self):
        """Standardized no-op validator (original service missing)."""
        if self._compliance_validator is None:
            # Create a simple NoOp validator in-place to avoid missing module errors
            class NoOpValidator:
                def validate(self, content):
                    return True, []

                def sanitize(self, content):
                    return content

            self._compliance_validator = NoOpValidator()
        return self._compliance_validator

    @property
    def output_handler(self):
        """Lazy-loaded Output Handler service."""
        if self._output_handler is None:
            from core.output_handler import OutputHandler

            self._output_handler = OutputHandler(self)
        return self._output_handler

    def get_current_time(self):
        """Utility to get standardized current time."""
        return datetime.now(UTC)

    async def close_all(self):
        """Gracefully closes all initialized async services."""
        tasks = []
        services = [
            self._gemini_service,
            self._database,
            self._x_service,
            self._bluesky_service,
        ]

        for service in services:
            if service and hasattr(service, "close"):
                res = service.close()
                if asyncio.iscoroutine(res):
                    tasks.append(res)

        if tasks:
            logger.info(f"[ServiceContainer] Closing {len(tasks)} async services...")
            await asyncio.gather(*tasks, return_exceptions=True)
            logger.info("[ServiceContainer] All async services closed.")
