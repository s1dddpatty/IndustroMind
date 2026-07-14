"""
Application configuration management using Pydantic Settings.
Loads from environment variables with sensible defaults.
"""

import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "ET-Hack-Backend"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"
    DOCS_URL: str = "/docs"
    REDOC_URL: str = "/redoc"

    # Security
    SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BCRYPT_ROUNDS: int = 12

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://neuroplant:neuroplant@localhost:5432/neuroplant"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_ECHO: bool = False

    # File storage
    UPLOAD_DIR: str = str(Path("data/uploads").resolve())
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: list[str] = [
        ".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp",
        ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv",
    ]

    # Authentication
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Mock mode (matches existing NEUROPLANT_MOCK_MODE pattern)
    MOCK_MODE: bool = True

    # Redis (for background tasks & notifications)
    REDIS_URL: str = "redis://localhost:6379/0"

    # External services (Person 2 AI modules)
    CEREBRAS_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"


settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
