"""JWT verification and token handling utilities."""
from datetime import datetime
from typing import Optional

from jose import JWTError, jwt

from app.core.config import settings


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def verify_token(token: str) -> bool:
    """
    Verify if a JWT token is valid.

    Args:
        token: JWT token string

    Returns:
        True if token is valid, False otherwise
    """
    payload = decode_token(token)
    if payload is None:
        return False

    # Check expiration
    exp = payload.get("exp")
    if exp is not None:
        if datetime.utcnow().timestamp() > exp:
            return False

    return True


def extract_user_id(token: str) -> Optional[str]:
    """
    Extract user_id from JWT token.

    Args:
        token: JWT token string

    Returns:
        user_id if present in token, None otherwise
    """
    payload = decode_token(token)
    if payload is None:
        return None

    return payload.get("user_id") or payload.get("sub")
