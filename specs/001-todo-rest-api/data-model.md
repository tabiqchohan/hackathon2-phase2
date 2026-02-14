# Data Model: Multi-User Todo REST API

**Feature**: 001-todo-rest-api | **Date**: 2026-02-13
**Related**: [spec.md](./spec.md) | [plan.md](./plan.md)

## Overview

This document defines the data entities, their attributes, relationships, and validation rules for the Todo REST API. The data model is designed to support multi-user todo management with strict user-level data isolation.

## Entities

### Todo

Represents a task item owned by a single user.

**Purpose**: Store user-created tasks with title, description, completion status, and timestamps.

**Attributes**:

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, Auto-generated | Unique identifier for the todo |
| title | String | NOT NULL, Max 200 chars | Task title (required) |
| description | String | NULLABLE, Max 2000 chars | Optional detailed description |
| completed | Boolean | NOT NULL, Default: false | Completion status |
| user_id | String | NOT NULL, FOREIGN KEY (external), Indexed | Owner's user identifier (from Better Auth) |
| created_at | DateTime | NOT NULL, Auto-generated | Timestamp when todo was created (UTC) |
| updated_at | DateTime | NOT NULL, Auto-updated | Timestamp when todo was last modified (UTC) |
| completed_at | DateTime | NULLABLE | Timestamp when todo was marked complete (UTC) |

**Indexes**:
- Primary index on `id`
- Index on `user_id` (for efficient user-scoped queries)
- Composite index on `(user_id, completed)` (for filtered list queries)

**Validation Rules**:
- `title` must not be empty string (after trimming whitespace)
- `title` length must be between 1 and 200 characters
- `description` length must not exceed 2000 characters if provided
- `completed_at` must be NULL when `completed` is false
- `completed_at` must be set when `completed` transitions from false to true
- `user_id` must be a valid user identifier (validated by Better Auth)

**State Transitions**:

```text
┌─────────────┐
│  Created    │ (completed = false, completed_at = NULL)
│ (Initial)   │
└──────┬──────┘
       │
       │ Mark Complete
       ▼
┌─────────────┐
│  Completed  │ (completed = true, completed_at = timestamp)
└──────┬──────┘
       │
       │ Mark Incomplete
       ▼
┌─────────────┐
│ Incomplete  │ (completed = false, completed_at = NULL)
└─────────────┘
```

**Business Rules**:
1. A todo can only be accessed, modified, or deleted by its owner (user_id)
2. Deleting a todo is permanent (no soft delete)
3. Updating a todo's title or description updates `updated_at`
4. Toggling completion status updates both `updated_at` and `completed_at`
5. `completed_at` is cleared when a todo is marked incomplete

### User (External Entity)

**Note**: User entity is managed by Better Auth (external system). The API does not store or manage user data directly.

**Reference**: The `user_id` field in Todo entity references users managed by Better Auth. The API only validates that the user_id from the JWT token is valid.

**Attributes Known to API**:
- `user_id` (String): Unique identifier extracted from JWT token

## Relationships

```text
┌──────────────────┐
│  User (External) │
│  Better Auth     │
└────────┬─────────┘
         │
         │ 1:N (owns)
         │
         ▼
    ┌────────┐
    │  Todo  │
    └────────┘
```

**Relationship Rules**:
- One user can own many todos (1:N)
- Each todo belongs to exactly one user
- User deletion is handled by Better Auth (out of scope for this API)
- If a user is deleted in Better Auth, their todos become orphaned (future consideration: cascade delete or data retention policy)

## Database Schema (PostgreSQL)

```sql
-- Table: todos
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL CHECK (length(trim(title)) > 0),
    description VARCHAR(2000),
    completed BOOLEAN NOT NULL DEFAULT false,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT check_completed_at_consistency
        CHECK (
            (completed = false AND completed_at IS NULL) OR
            (completed = true AND completed_at IS NOT NULL)
        )
);

-- Indexes
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_user_completed ON todos(user_id, completed);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## SQLModel Implementation

```python
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
                "completed_at": None
            }
        }
```

## API Schemas (Pydantic)

### TodoCreate (Request)

```python
from pydantic import BaseModel, Field, field_validator

class TodoCreate(BaseModel):
    """Schema for creating a new todo."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()
```

### TodoUpdate (Request)

```python
class TodoUpdate(BaseModel):
    """Schema for updating an existing todo."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: Optional[bool] = Field(default=None)

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip() if v else None
```

### TodoResponse (Response)

```python
from uuid import UUID
from datetime import datetime

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
```

### TodoListResponse (Response)

```python
class TodoListResponse(BaseModel):
    """Schema for paginated todo list responses."""

    items: list[TodoResponse]
    total: int
    skip: int
    limit: int
```

## Data Validation Summary

| Validation | Layer | Enforcement |
|------------|-------|-------------|
| Title not empty | API (Pydantic) | Request validation |
| Title max 200 chars | API (Pydantic) + DB (constraint) | Request validation + database constraint |
| Description max 2000 chars | API (Pydantic) + DB (constraint) | Request validation + database constraint |
| User ID present | API (JWT dependency) | Authentication middleware |
| User owns todo | Service layer | Query filtering by user_id |
| Completed_at consistency | DB (constraint) | Database check constraint |
| Timestamps auto-set | DB (trigger) + ORM (default_factory) | Database trigger + SQLModel defaults |

## Migration Strategy

**Initial Migration** (Alembic):
1. Create `todos` table with all columns and constraints
2. Create indexes on `user_id` and `(user_id, completed)`
3. Create trigger for auto-updating `updated_at`

**Future Migrations** (if needed):
- Add columns with ALTER TABLE (ensure backward compatibility)
- Create new indexes for query optimization
- Add constraints as needed

**Rollback Strategy**:
- Each migration includes a downgrade function
- Downgrades drop added columns/indexes/constraints
- Data loss acceptable for development; production requires data migration plan

## Performance Considerations

**Query Optimization**:
- Index on `user_id` enables fast user-scoped queries (O(log n) lookup)
- Composite index on `(user_id, completed)` optimizes filtered list queries
- UUID primary key provides globally unique IDs without coordination

**Expected Query Patterns**:
1. List todos for user (filtered by completion status): `SELECT * FROM todos WHERE user_id = ? AND completed = ? LIMIT ? OFFSET ?`
2. Get single todo: `SELECT * FROM todos WHERE id = ? AND user_id = ?`
3. Create todo: `INSERT INTO todos (...) VALUES (...)`
4. Update todo: `UPDATE todos SET ... WHERE id = ? AND user_id = ?`
5. Delete todo: `DELETE FROM todos WHERE id = ? AND user_id = ?`

**Scalability**:
- Current design supports ~1000 todos per user efficiently
- Pagination prevents large result sets
- User-scoped queries prevent cross-user data leakage
- Connection pooling handles concurrent requests

## Security Considerations

**Data Isolation**:
- All queries MUST include `WHERE user_id = :user_id` filter
- Service layer enforces user-scoping (cannot be bypassed by routes)
- No shared todos or public access in this version

**Sensitive Data**:
- Todo titles and descriptions may contain sensitive information
- No encryption at rest (relies on database-level encryption)
- No PII expected in todos (user responsibility)

**Audit Trail**:
- Timestamps provide basic audit trail (created, updated, completed)
- No change history or soft delete in this version
- Future consideration: audit log table for compliance
