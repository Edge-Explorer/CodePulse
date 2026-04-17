from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path 
import os

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "CodePulse API"
    DEBUG: bool = True
    DATABASE_URL: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    JWT_SECRET: str = "dev_secret_key_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"

    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    ACCESS_TOKEN_EXPIRE_MINUTES: int= 60
    
    model_config = SettingsConfigDict(
        env_file = os.path.join(ROOT_DIR, ".env"),
        extra = "ignore"
    )

settings = Settings()