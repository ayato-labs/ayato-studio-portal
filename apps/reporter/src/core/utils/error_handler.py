import functools
import logging
from collections.abc import Callable
from typing import Any

logger = logging.getLogger(__name__)


def safe_execute(
    default_return: Any = None,
    exceptions: type[Exception] | tuple[type[Exception], ...] = Exception,
    log_level: int = logging.ERROR,
    quiet: bool = False,
):
    """
    Decorator to safely execute a function, catching specified exceptions and logging them.

    Args:
        default_return: The value to return if an exception occurs. Standard is None.
        exceptions: A single exception class or a tuple of exception classes to catch.
        log_level: The logging level to use for the exception.
        quiet: If True, only log a simple error message instead of the full traceback.
    """

    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except exceptions as e:
                if not quiet:
                    logger.exception(f"Error executing {func.__name__}: {e}")
                else:
                    logger.log(log_level, f"Error executing {func.__name__}: {e}")
                return default_return

        return wrapper

    return decorator


def safe_execute_async(
    default_return: Any = None,
    exceptions: type[Exception] | tuple[type[Exception], ...] = Exception,
    log_level: int = logging.ERROR,
    quiet: bool = False,
):
    """Async version of safe_execute."""

    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except exceptions as e:
                if not quiet:
                    logger.exception(f"Error executing async {func.__name__}: {e}")
                else:
                    logger.log(log_level, f"Error executing async {func.__name__}: {e}")
                return default_return

        return wrapper

    return decorator
