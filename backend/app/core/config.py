"""Core configuration settings for the Todo REST API."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str

    # JWT Configuration
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    # Application
    APP_NAME: str = "Todo REST API"
    DEBUG: bool = False

    # CORS (optional)
    CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


# Global settings instance
settings = Settings()
