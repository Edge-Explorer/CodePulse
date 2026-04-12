from fastapi import Depends, HTTPException, status 
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.core.config import settings
from src.core.database import get_db
from src.models.user import User

oauth2_scheme= OAuth2PasswordBearer(tokenUrl= "/auth/login")

async def get_current_user(
    token: str= Depends(oauth2_scheme),
    db: AsyncSession= Depends(get_db)
):
    credentials_exception= HTTPException(
        status_code= status.HTTP_401_UNAUTHORIZED,
        detail= "Could not validate credentials",
        headers= {"WWW-Authenticate": "Bearer"},
    )

    try:
        # 1. Decode the token using our secret key
        payload= jwt.decode(token, settings.JWT_SECRET, algorithms= [settings.JWT_ALGORITHM])
        user_id: str= payload.get("sub") # "sub" is where we stored the user_id

        if user_id is None:
            raise credentials_exception
    
    except JWTError:
        raise credentials_exception

    # 2. Check if the user still exists in our database
    query= select(User).where(User.id == int(user_id))
    result= await db.execute(query)
    user= result.scalars().first()

    if user is None:
        raise credentials_exception
    
    return user