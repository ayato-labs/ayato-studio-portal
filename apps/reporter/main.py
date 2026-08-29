import argparse
import asyncio
import logging
import socket
import sys
import warnings
from datetime import datetime

from dateutil.parser import UnknownTimezoneWarning

# Suppress dateutil warnings globally for clean PowerShell output
warnings.filterwarnings("ignore", category=UnknownTimezoneWarning)

from config import settings
from core.engine import IntelligenceEngine
from core.service_container import ServiceContainer
from core.utils.logger import LogManager
from core.utils.preflight import PreflightValidator

# Set global default timeout to prevent infinite hangs
socket.setdefaulttimeout(120)

# Force UTF-8 for stdout/stderr on Windows
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")
except Exception as e:
    print(f"Warning: Failed to reconfigure stdout encoding: {e}")

# Logging Setup: Use centralized Cloud-Native logger
LogManager.setup(level=logging.INFO)
logger = logging.getLogger("LocalRunner")

# Generate a unique run ID
run_id = datetime.now().strftime("%Y%m%d_%H%M%S")


async def main_async():
    parser = argparse.ArgumentParser(description="Ayato Intelligence Engine - Local Runner")
    parser.add_argument(
        "--engine",
        default="all",
        help="Engine or Plugin ID to run (e.g., tech, energy, finance)",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug mode (process only 1 doc per engine)",
    )
    parser.add_argument(
        "--parallel",
        action="store_true",
        help="Run all engines concurrently",
    )
    parser.add_argument(
        "--skip-social",
        action="store_true",
        help="Skip SNS propagation even if not in dry-run",
    )
    parser.add_argument(
        "--skip-rebuild",
        action="store_true",
        help="Skip portal rebuild trigger",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Bypass duplication checks and process all items",
    )
    args = parser.parse_args()

    # --- Mode Configuration ---
    if args.debug:
        settings.IS_DEBUG_MODE = True
        logging.getLogger().setLevel(logging.DEBUG)

    logger.info("Ayato Intelligence Engine Starting...")
    logger.info(f"  Run ID: {run_id}")
    logger.info(f"  Python Version: {sys.version}")

    # --- Initialization ---
    container = ServiceContainer()
    container.run_id = run_id
    engine = IntelligenceEngine(container)

    # --- Pre-flight Validation ---
    is_valid = await PreflightValidator.run_all(container)
    if not is_valid:
        logger.critical("[Main] Aborting execution due to infrastructure validation failure.")
        sys.exit(1)

    # --- Execution ---
    try:
        # Pass flags directly to IntelligenceEngine.execute()
        await engine.execute(
            plugin_id=args.engine,
            parallel=args.parallel,
            skip_social=args.skip_social,
            skip_rebuild=args.skip_rebuild,
            force=args.force,
        )
        logger.info("Ayato Intelligence Engine: Run Completed Successfully.")
    except Exception as e:
        logger.critical(f"Ayato Intelligence Engine: Run Failed with error: {e}")
        import traceback

        logger.error(traceback.format_exc())
        sys.exit(1)


if __name__ == "__main__":
    try:
        asyncio.run(main_async())
    except KeyboardInterrupt:
        logger.info("Run interrupted by user.")
        sys.exit(0)
