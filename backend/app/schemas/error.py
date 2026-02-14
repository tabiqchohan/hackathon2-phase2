"""Error response models."""
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """Standard error response format."""

    detail: str
    error_code: str

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Todo not found",
                "error_code": "TODO_NOT_FOUND"
            }
        }
