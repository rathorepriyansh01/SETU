import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SETU — Smart Emergency & Healthcare Resilience Platform"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./setu.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "setu_super_secret_jwt_key_2026_bhopal_resilience")

    @property
    def sync_database_url(self) -> str:
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        return self.DATABASE_URL
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days for demo ease
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
    DEFAULT_CITY: str = "Bhopal"
    DEFAULT_STATE: str = "Madhya Pradesh"
    # Bhopal center coordinates
    DEFAULT_LAT: float = 23.259933
    DEFAULT_LNG: float = 77.412613

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
