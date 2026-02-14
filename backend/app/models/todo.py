"""Todo database model."""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class Todo(SQLModel, table=True):
    """Todo database model with user-scoped access."""

    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    user_id: str = Field(index=True, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

    class Config:
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
