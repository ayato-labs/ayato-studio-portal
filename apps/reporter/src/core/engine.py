import asyncio
import logging
from datetime import datetime

from config import settings

logger = logging.getLogger(__name__)


class IntelligenceEngine:
    """
    Ayato Intelligence Engine Orchestrator.
    Handles plugin execution, output processing, and SNS propagation.
    """

    def __init__(self, container, run_id: str = None):
        self.container = container
        self.run_id = run_id or datetime.now().strftime("%Y%m%d_%H%M%S")
        self.plugin_manager = container.plugin_manager
        self.output_handler = container.output_handler

        logger.info(f"[Engine] Initialized with RunID: {self.run_id}")

    async def execute(
        self,
        plugin_id: str = "all",
        parallel: bool = False,
        skip_social: bool = False,
        skip_rebuild: bool = False,
        force: bool = False,
    ):
        """Orchestrates the selected plugins and handles artifacts."""
        # --- 0. Warm-up ---
        self.container.force_mode = force
        if force:
            logger.info("[Engine] DEBUG FORCE MODE ACTIVE. Bypassing duplication checks.")
            if not skip_social:
                logger.warning(
                    "[Engine] SNS propagation is ENABLED in force mode. Be careful with API quotas."
                )

        # Initialize metrics early to ensure start_time is accurate
        _ = self.container.metrics_service
        logger.info(f"[Engine] Starting execution (Run ID: {self.run_id})")

        available_plugins = [p["id"] for p in self.plugin_manager.get_all_manifests()]
        plugin_ids = []

        if plugin_id == "all":
            plugin_ids = available_plugins
        elif plugin_id in available_plugins:
            plugin_ids = [plugin_id]
        else:
            logger.warning(f"[Engine] Requested plugin '{plugin_id}' not found.")
            return

        if not plugin_ids:
            logger.info("[Engine] No plugins to execute.")
            return

        # Core Execution
        all_new_items = []
        all_new_artifacts = []
        if parallel:
            logger.info(f"[Engine] Executing {len(plugin_ids)} plugins in PARALLEL...")
            tasks = [self._create_plugin_task(p_id, force=force) for p_id in plugin_ids]
            results = await asyncio.gather(*tasks)
            for artifacts, items in results:
                if items:
                    all_new_items.extend(items)
                if artifacts:
                    all_new_artifacts.extend(artifacts)
        else:
            logger.info(f"[Engine] Executing {len(plugin_ids)} plugins SEQUENTIALLY...")
            for p_id in plugin_ids:
                artifacts, items = await self._create_plugin_task(p_id, force=force)
                if items:
                    all_new_items.extend(items)
                if artifacts:
                    all_new_artifacts.extend(artifacts)

        # Hatena Blog Combined Propagation (Hub strategy)
        if not skip_social and all_new_artifacts:
            jp_artifacts = [a for a in all_new_artifacts if getattr(a, "language", "jp") == "jp"]
            if jp_artifacts:
                logger.info(
                    f"[Engine] Starting Hatena Blog Combined Propagation for {len(jp_artifacts)} artifacts..."
                )
                await self.container.hatena_service.post_combined_digest(
                    jp_artifacts, self.container.gemini_service
                )

        # Global Propagation Phase
        if not skip_social:
            await self._propagate_to_sns(all_new_items)

        # --- Portal Rebuild Chain ---
        if not skip_rebuild and "tech" in plugin_ids:
            await self.container.github_service.trigger_portal_rebuild()

        # Cleanup & Metrics
        await self._finalize()

    async def _create_plugin_task(self, p_id: str, force: bool = False) -> tuple[list, list]:
        """Wrapper to manage single plugin execution lifecycle."""
        try:
            plugin_cls = self.plugin_manager.load_plugin(p_id)
            plugin_inst = plugin_cls()
            logger.info(f"[Engine] Starting plugin: {p_id} (force={force})")
            artifacts, items = await plugin_inst.run(self.container, force=force)
            await self.output_handler.process_artifacts(artifacts)
            logger.info(f"[Engine] Successfully completed plugin: {p_id}")
            return artifacts, items
        except Exception:
            logger.exception(f"[Engine] Critical failure in plugin: {p_id}")
            return [], []

    async def _propagate_to_sns(self, items: list[dict]):
        """Orchestrates the global SNS posting phase."""
        if not items:
            logger.info("[Engine] No new items to propagate to SNS.")
            return

        logger.info(f"[Engine] Starting Global SNS Propagation for {len(items)} items...")
        try:
            # Sort by score to ensure top items are posted if limited
            sorted_items = sorted(items, key=lambda x: x.get("score", 0), reverse=True)

            async def safe_post(platform_name, service_call):
                try:
                    # Individual platform timeout (20s)
                    await asyncio.wait_for(service_call, timeout=20.0)
                except TimeoutError:
                    logger.error(f"[Engine] {platform_name} Propagation Timed Out (20s)")
                except Exception as e:
                    logger.error(f"[Engine] {platform_name} Propagation Failed: {e}")

            await asyncio.gather(
                safe_post(
                    "X", self.container.x_service.execute_top_posts(items=sorted_items, limit=3)
                ),
                safe_post(
                    "BlueSky",
                    self.container.bluesky_service.execute_top_posts(items=sorted_items, limit=3),
                ),
            )
        except Exception as e:
            logger.error(f"[Engine] Social Posting Failed: {e}")

    async def _finalize(self):
        """Performs database maintenance and metrics finalization."""
        logger.info("[Engine] Performing final cleanup and metrics collection...")
        try:
            # 1. Database Maintenance
            await self.container.database.delete_old_data(days=settings.RAW_ITEMS_TTL_DAYS)

            # 2. Metrics Collection
            self.container.metrics_service.finalize_run()
            logger.info(self.container.metrics_service.get_summary())

            # 3. Graceful Shutdown of All Async Clients
            await self.container.close_all()

            logger.info("[Engine] Finalization complete.")
        except Exception as e:
            logger.error(f"[Engine] Finalization failed: {e}")
