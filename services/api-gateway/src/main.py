from fastapi import FastAPI 
from src.core.config import settings

app= FastAPI(
    title= settings.APP_NAME,
    description= "The entry point for CodePulse AI DevOps Platform",
    version= "0.1.0"
)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "debug_mode": settings.DEBUG
    }