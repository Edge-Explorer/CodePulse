from fastapi import FastAPI 
from src.core.config import settings
from src.routers import auth, users, projects, contact
from src.core.kafka import init_kafka, stop_kafka
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_kafka()
    yield
    await stop_kafka()

app= FastAPI(
    title= settings.APP_NAME,
    description= "The entry point for CodePulse AI DevOps Platform",
    version= "0.1.0",
    lifespan= lifespan
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(contact.router)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "debug_mode": settings.DEBUG
    }