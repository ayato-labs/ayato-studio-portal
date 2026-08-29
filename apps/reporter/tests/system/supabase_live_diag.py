import asyncio
import logging
import os
import sys
from datetime import datetime

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from core.interfaces.plugin import ReportArtifact
from core.service_container import ServiceContainer
from core.utils.logger import LogManager


async def run_report_test():
    LogManager.setup()
    logger = logging.getLogger("TestReport")
    logger.info("Starting End-to-End Report Generation Test...")

    # 1. Initialize Container
    container = ServiceContainer(dry_run=False)

    # 2. Create a Dummy Artifact
    artifact = ReportArtifact(
        title=f"Test Report - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        content="## Test Report Content\n\nThis is a simulation to verify Supabase connectivity for generated_reports.\n\n- Fact 1: AI is evolving.\n- Fact 2: Supabase is working correctly.",
        filename=f"test-report-{int(datetime.now().timestamp())}",
        category="Diagnostics",
        market="tech",
        score=99,
        language="jp",
    )

    # 3. Process via OutputHandler (This should trigger DBManager.save_report)
    logger.info(f"Processing dummy artifact: {artifact.title}")
    await container.output_handler.process_artifacts([artifact])

    logger.info("Test complete. Check Supabase 'generated_reports' table.")


if __name__ == "__main__":
    asyncio.run(run_report_test())
