"""Todo API endpoints."""
from typing import Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user, get_db
from app.core.exceptions import ForbiddenError, TodoNotFoundError
from app.schemas.error import ErrorResponse
from app.schemas.todo import TodoCreate, TodoListResponse, TodoResponse, TodoUpdate
from app.services import todo as todo_service

router = APIRouter()


@router.post(
    "/",
    response_model=TodoResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def create_todo(
    todo_data: TodoCreate,
    current_user: Annotated[str, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    """
    Create a new todo for the authenticated user.

    Args:
        todo_data: Todo creation data
        current_user: User ID from JWT token
        db: Database session

    Returns:
        Created todo
    """
    try:
        todo = todo_service.create_todo(db, current_user, todo_data)
        return todo
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=TodoListResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def list_todos(
    current_user: Annotated[str, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    skip: int = Query(default=0, ge=0, description="Number of todos to skip"),
    limit: int = Query(default=20, ge=1, le=100, description="Maximum number of todos to return"),
    completed: Optional[bool] = Query(
        default=None, description="Filter by completion status (omit for all)"
    ),
):
    """
    List todos for the authenticated user with pagination and filtering.

    Args:
        current_user: User ID from JWT token
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        completed: Filter by completion status

    Returns:
        Paginated list of todos
    """
    todos, total = todo_service.get_todos(db, current_user, skip, limit, completed)
    return TodoListResponse(items=todos, total=total, skip=skip, limit=limit)


@router.get(
    "/{todo_id}",
    response_model=TodoResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "Not found"},
    },
)
async def get_todo(
    todo_id: UUID,
    current_user: Annotated[str, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    """
    Get a specific todo by ID.

    Args:
        todo_id: Todo ID
        current_user: User ID from JWT token
        db: Database session

    Returns:
        Todo details

    Raises:
        HTTPException: 404 if todo not found or 403 if user doesn't own it
    """
    todo = todo_service.get_todo_by_id(db, current_user, todo_id)
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )
    return todo


@router.patch(
    "/{todo_id}",
    response_model=TodoResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "Not found"},
    },
)
async def update_todo(
    todo_id: UUID,
    todo_data: TodoUpdate,
    current_user: Annotated[str, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    """
    Update a todo (title, description, or completion status).

    Args:
        todo_id: Todo ID
        todo_data: Todo update data
        current_user: User ID from JWT token
        db: Database session

    Returns:
        Updated todo

    Raises:
        HTTPException: 404 if todo not found, 403 if user doesn't own it, 400 for validation errors
    """
    try:
        todo = todo_service.update_todo(db, current_user, todo_id, todo_data)
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Todo with id {todo_id} not found",
            )
        return todo
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "Not found"},
    },
)
async def delete_todo(
    todo_id: UUID,
    current_user: Annotated[str, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    """
    Delete a todo permanently.

    Args:
        todo_id: Todo ID
        current_user: User ID from JWT token
        db: Database session

    Raises:
        HTTPException: 404 if todo not found or 403 if user doesn't own it
    """
    deleted = todo_service.delete_todo(db, current_user, todo_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )
