from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class AppConfig(BaseSettings):
    APP_NAME: str = "Todo API"
    APP_ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./todo.db"
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production-123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache()
def getappconfig() -> AppConfig:
    return AppConfig()
