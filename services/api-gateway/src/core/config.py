from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str= "CodePulse API"
    DEBUG: bool= True
    DATABASE_URL: str= ""
    GITHUB_CLIENT_ID: str=""
    JWT_SECRET: str= "dev_secret_key_change_in_production"
    JWT_ALGORITHM: str= "HS256"

    model_config= SettingsConfigDict(
        env_file= ".env",
        extra= "ignore"
    )

settings= Settings()