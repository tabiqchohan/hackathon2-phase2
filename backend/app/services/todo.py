"""Todo service layer with business logic."""
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate


def create_todo(db: Session, user_id: str, todo_data: TodoCreate) -> Todo:
    """
    Create a new todo for the specified user.

    Args:
        db: Database session
        user_id: User ID from JWT token
        todo_data: Todo creation data

    Returns:
        Created todo
    """
    todo = Todo(
        title=todo_data.title,
        description=todo_data.description,
        user_id=user_id,
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def get_todos(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 20,
    completed: Optional[bool] = None,
) -> tuple[list[Todo], int]:
    """
    Get todos for the specified user with pagination and filtering.

    Args:
        db: Database session
        user_id: User ID from JWT token
        skip: Number of records to skip
        limit: Maximum number of records to return
        completed: Filter by completion status (None = all)

    Returns:
        Tuple of (list of todos, total count)
    """
    # Build query with user filter
    query = select(Todo).where(Todo.user_id == user_id)

    # Add completion filter if specified
    if completed is not None:
        query = query.where(Todo.completed == completed)

    # Get total count
    count_query = select(Todo).where(Todo.user_id == user_id)
    if completed is not None:
        count_query = count_query.where(Todo.completed == completed)
    total = len(db.exec(count_query).all())

    # Apply pagination and execute
    query = query.offset(skip).limit(limit)
    todos = db.exec(query).all()

    return list(todos), total


def get_todo_by_id(db: Session, user_id: str, todo_id: UUID) -> Optional[Todo]:
    """
    Get a specific todo by ID for the specified user.

    Args:
        db: Database session
        user_id: User ID from JWT token
        todo_id: Todo ID

    Returns:
        Todo if found and owned by user, None otherwise
    """
    query = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    return db.exec(query).first()


def update_todo(
    db: Session, user_id: str, todo_id: UUID, todo_data: TodoUpdate
) -> Optional[Todo]:
    """
    Update a todo for the specified user.

    Args:
        db: Database session
        user_id: User ID from JWT token
        todo_id: Todo ID
        todo_data: Todo update data

    Returns:
        Updated todo if found and owned by user, None otherwise
    """
    todo = get_todo_by_id(db, user_id, todo_id)
    if not todo:
        return None

    # Track if completed status changed
    completed_changed = False
    if todo_data.completed is not None and todo_data.completed != todo.completed:
        completed_changed = True
        old_completed = todo.completed

    # Update fields
    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.description is not None:
        todo.description = todo_data.description
    if todo_data.completed is not None:
        todo.completed = todo_data.completed

    # Handle completed_at timestamp
    if completed_changed:
        if todo.completed:
            # Set completed_at when marking as complete
            todo.completed_at = datetime.utcnow()
        else:
            # Clear completed_at when marking as incomplete
            todo.completed_at = None

    # Update updated_at timestamp
    todo.updated_at = datetime.utcnow()

    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def delete_todo(db: Session, user_id: str, todo_id: UUID) -> bool:
    """
    Delete a todo for the specified user.

    Args:
        db: Database session
        user_id: User ID from JWT token
        todo_id: Todo ID

    Returns:
        True if deleted, False if not found or not owned by user
    """
    todo = get_todo_by_id(db, user_id, todo_id)
    if not todo:
        return False

    db.delete(todo)
    db.commit()
    return True
