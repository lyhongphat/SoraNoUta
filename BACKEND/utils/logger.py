"""
Logging configuration and utilities.
"""
import logging
import sys
from typing import Optional


def setup_logger(
    name: str = "sora-no-uta",
    level: int = logging.INFO,
    log_format: Optional[str] = None
) -> logging.Logger:
    """
    Setup and configure logger.

    Args:
        name: Logger name
        level: Logging level
        log_format: Custom log format

    Returns:
        Configured logger instance
    """
    if log_format is None:
        log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)
    formatter = logging.Formatter(log_format)
    handler.setFormatter(formatter)

    # Avoid adding multiple handlers
    if not logger.handlers:
        logger.addHandler(handler)

    return logger


# Default logger instance
logger = setup_logger()
