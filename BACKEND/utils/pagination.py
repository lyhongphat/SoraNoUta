"""
Pagination utilities for API endpoints.
"""
from typing import TypeVar, Generic, List
from pydantic import BaseModel
from fastapi import Query


T = TypeVar("T")


class PaginationParams(BaseModel):
    """Common pagination parameters."""
    skip: int = Query(0, ge=0, description="Number of records to skip")
    limit: int = Query(
        10, ge=1, le=100, description="Maximum number of records to return")


class PageResponse(BaseModel, Generic[T]):
    """Standardized paginated response."""
    items: List[T]
    total: int
    skip: int
    limit: int

    class Config:
        from_attributes = True


def get_pagination_params(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        10, ge=1, le=100, description="Maximum number of records to return"),
) -> dict:
    """Dependency for pagination parameters."""
    return {"skip": skip, "limit": limit}
