from fastapi import Depends, HTTPException, status 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials # Added this
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.core.config import settings
from src.core.database import get_db
from src.models.user import User

# Switch from OAuth2PasswordBearer to HTTPBearer
security = HTTPBearer()

async def get_current_user(
    auth: HTTPAuthorizationCredentials = Depends(security), # Change: use auth
    db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Access the token via auth.credentials
        token = auth.credentials
        
        # 1. Decode the token using our secret key
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub") 

        if user_id is None:
            raise credentials_exception
    
    except JWTError:
        raise credentials_exception

    # 2. Check if the user still exists in our database
    query = select(User).where(User.id == int(user_id))
    result = await db.execute(query)
    user = result.scalars().first()

    if user is None:
        raise credentials_exception
    
    return user