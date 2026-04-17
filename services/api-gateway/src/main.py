from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.routers import auth, users, projects, contact
from src.core.kafka import init_kafka, stop_kafka
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_kafka()
        print("✅ Kafka Initialized Successfully")
    except Exception as e:
        print(f"⚠️ Kafka initialization failed: {e}. AI scanning features will be unavailable.")
    yield
    try:
        await stop_kafka()
    except Exception:
        pass

app= FastAPI(
    title= settings.APP_NAME,
    description= "The entry point for CodePulse AI DevOps Platform",
    version= "0.1.0",
    lifespan= lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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