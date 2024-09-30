"""
Response utilities for standardized API responses.
"""
from typing import Optional, Any, Dict
from pydantic import BaseModel


class SuccessResponse(BaseModel):
    """Standard success response."""
    success: bool = True
    message: str
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Standard error response."""
    success: bool = False
    error: str
    detail: Optional[str] = None


def success_response(message: str, data: Optional[Any] = None) -> Dict:
    """Create a standardized success response."""
    return {
        "success": True,
        "message": message,
        "data": data
    }


def error_response(error: str, detail: Optional[str] = None) -> Dict:
    """Create a standardized error response."""
    return {
        "success": False,
        "error": error,
        "detail": detail
    }
