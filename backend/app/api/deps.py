"""Dependency injection for API endpoints."""
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session

from app.core.database import get_db as get_database_session
from app.core.exceptions import UnauthorizedError
from app.core.security import extract_user_id, verify_token


async def get_current_user(authorization: Annotated[str | None, Header()] = None) -> str:
    """
    Extract and verify user from JWT token in Authorization header.

    Args:
        authorization: Authorization header value (Bearer <token>)

    Returns:
        user_id extracted from JWT token

    Raises:
        HTTPException: If token is missing, invalid, or expired
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract token from "Bearer <token>" format
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]

    # Verify token
    if not verify_token(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired JWT token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user_id
    user_id = extract_user_id(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain user_id",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


def get_db() -> Session:
    """
    Dependency for database session injection.

    This is a wrapper around the database session generator.
    """
    return Depends(get_database_session)
