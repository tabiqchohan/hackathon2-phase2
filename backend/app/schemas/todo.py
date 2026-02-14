"""Todo request and response schemas."""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class TodoCreate(BaseModel):
    """Schema for creating a new todo."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        """Validate that title is not empty after trimming."""
        if not v.strip():
            raise ValueError("Title cannot be empty or whitespace only")
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
            }
        }


class TodoUpdate(BaseModel):
    """Schema for updating an existing todo."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: Optional[bool] = Field(default=None)

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        """Validate that title is not empty after trimming if provided."""
        if v is not None and not v.strip():
            raise ValueError("Title cannot be empty or whitespace only")
        return v.strip() if v else None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries and supplies",
                "description": "Milk, eggs, bread, coffee",
                "completed": True,
            }
        }


class TodoResponse(BaseModel):
    """Schema for todo responses."""

    id: UUID
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True  # Enable ORM mode for SQLModel compatibility
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "user_id": "user_123",
                "created_at": "2026-02-13T10:00:00Z",
                "updated_at": "2026-02-13T10:00:00Z",
                "completed_at": None,
            }
        }


class TodoListResponse(BaseModel):
    """Schema for paginated todo list responses."""

    items: list[TodoResponse]
    total: int
    skip: int
    limit: int

    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "title": "Buy groceries",
                        "description": "Milk, eggs, bread",
                        "completed": False,
                        "user_id": "user_123",
                        "created_at": "2026-02-13T10:00:00Z",
                        "updated_at": "2026-02-13T10:00:00Z",
                        "completed_at": None,
                    }
                ],
                "total": 1,
                "skip": 0,
                "limit": 20,
            }
        }
