"""
Common dependencies for FastAPI endpoints.
"""
from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session

from BACKEND.data.db import get_db
from BACKEND.utils.redis_utils import get_redis_cache, Redis_Caching


def get_cache() -> Redis_Caching:
    """Dependency to get Redis cache instance."""
    return get_redis_cache()


def get_database() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    return get_db()
