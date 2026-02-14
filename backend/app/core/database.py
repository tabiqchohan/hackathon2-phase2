"""Database engine and session management."""
from typing import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=5,
    max_overflow=10,
)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for database session injection.

    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        yield session
