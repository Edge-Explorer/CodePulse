from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from src.core.config import settings

# 1. Create the Engine
engine= create_async_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo= True,
)

# 2. Create the Session factory
SessionLocal= async_sessionmaker(
    bind= engine,
    class_= AsyncSession,
    expire_on_commit= False
)

# 3. Create the Base class for our Models
class Base(DeclarativeBase):
    pass

# 4. Dependency to get a DB session in our API routes
async def get_db():
    async with SessionLocal() as session:
        yield session