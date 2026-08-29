import logging
import os
import sys

from loguru import logger


class InterceptHandler(logging.Handler):
    """
    Default handler from examples in loguru document.
    Interceptors for standard logging.
    """

    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


class LogManager:
    """
    Centralized Logging Manager using Loguru.
    Supports JSON output for files, retention of last 2 runs, and error isolation.
    """

    @staticmethod
    def setup(level: str = "INFO"):
        # 1. Intercept standard logging
        logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)

        # 2. Remove default loguru handler
        logger.remove()

        # 3. Add console handler (Colored for dev readability)
        logger.add(
            sys.stdout,
            level=level,
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        )

        # 4. Add file handler for all logs (JSON format, retain last 2 runs)
        # We use a timestamped filename to ensure rotation on every run
        log_dir = "logs"
        os.makedirs(log_dir, exist_ok=True)

        logger.add(
            os.path.join(log_dir, "run_{time:YYYYMMDD_HHmmss}.log"),
            level=level,
            serialize=True,  # This enables JSON format
            retention=2,  # Keep only last 2 files
        )

        # 5. Add file handler for error isolation (JSON format)
        logger.add(
            os.path.join(log_dir, "error.log"),
            level="ERROR",
            serialize=True,
            rotation="10 MB",  # Prevent error.log from growing too large
        )

        # Silence verbose 3rd party loggers
        logging.getLogger("google").setLevel(logging.WARNING)
        logging.getLogger("urllib3").setLevel(logging.WARNING)
        logging.getLogger("httpx").setLevel(logging.WARNING)

        logger.info("LogManager: Loguru logging initialized with JSON file outputs.")
