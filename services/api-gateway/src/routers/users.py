from fastapi import APIRouter, Depends
from src.core.dependencies import get_current_user
from src.models.user import User

router= APIRouter(prefix= "/users", tags= ["Users"])

@router.get("/me")
async def read_users_me(current_user: User= Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "avatar": current_user.avatar_url,
        "joined_at": current_user.created_at
    }