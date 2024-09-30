"""
Custom exception classes and handlers.
"""
from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    """Resource not found exception."""

    def __init__(self, resource: str, id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} with id {id} not found"
        )


class DatabaseException(HTTPException):
    """Database operation exception."""

    def __init__(self, detail: str = "Database operation failed"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )


class CacheException(HTTPException):
    """Cache operation exception."""

    def __init__(self, detail: str = "Cache operation failed"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )


class ValidationException(HTTPException):
    """Validation exception."""

    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail
        )
