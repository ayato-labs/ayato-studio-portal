import json
import logging
import os
from datetime import datetime

from config import settings

logger = logging.getLogger(__name__)


class MetricsService:
    """
    Mock Metrics Service to track execution results.
    """

    def __init__(self):
        self.start_time = datetime.now()
        self.metrics = {
            "fetched_items": 0,
            "filtered_items": 0,
            "processed_items": 0,
            "failed_items": 0,
            "generated_reports": 0,
            "posted_updates": 0,
        }
        logger.info("[MetricsService] Initialized.")

    def finalize_run(self):
        self.end_time = datetime.now()
        duration = self.end_time - self.start_time
        self.metrics["duration_seconds"] = duration.total_seconds()

        # Save to local file if path exists
        try:
            os.makedirs(settings.DB_LOGS, exist_ok=True)
            report_path = os.path.join(
                settings.DB_LOGS,
                f"run_metrics_{datetime.now().strftime('%Y%m%d')}.json",
            )
            with open(report_path, "w", encoding="utf-8") as f:
                json.dump(self.metrics, f, indent=4)
        except Exception as e:
            logger.error(f"Failed to save metrics: {e}")

    def get_summary(self) -> str:
        return f"Run Summary: {json.dumps(self.metrics, indent=2)}"
