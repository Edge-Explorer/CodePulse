from fastapi import APIRouter, HTTPException, Depends
from src.core.config import settings
from sqlalchemy import select
from src.core.database import get_db
from src.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
from urllib.parse import urlencode
from fastapi.responses import RedirectResponse
from src.core.security import create_access_token

router= APIRouter(prefix= "/auth", tags= ["Authentication"])

GITHUB_AUTH_URL= "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL= "https://github.com/login/oauth/access_token"
GITHUB_USER_URL= "https://api.github.com/user"

# Frontend URL for redirect after OAuth
FRONTEND_URL= "http://localhost:5173"

@router.get("/github/login")
async def login():
    """Step 1: Redirect user to GitHub's permission page"""
    github_url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={settings.GITHUB_CLIENT_ID}&"
        f"scope=user:email repo"
    )
    return RedirectResponse(url=github_url)

@router.get("/callback")
async def github_callback(code: str, db: AsyncSession= Depends(get_db)):
    """Step 2 & 3: Exchange code for token, get user profile, redirect to frontend"""
    print(f"🚀 Received OAuth code: {code[:10]}...")
    if not code:
        raise HTTPException(status_code= 400, detail= "Authorization code missing")

    async with httpx.AsyncClient() as client:
        # Exchange code for token
        print("🛰️ Exchanging code for access token...")
        response= await client.post(
            GITHUB_TOKEN_URL,
            params= {
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers= {"Accept": "application/json"},
        )
        token_data= response.json()
        access_token= token_data.get("access_token")

        if not access_token:
            print(f"❌ Failed to get access token: {token_data}")
            # Redirect to frontend with error
            return RedirectResponse(url=f"{FRONTEND_URL}/?error=auth_failed")

        print("👤 Fetching user profile from GitHub...")
        # Get User Profile
        user_response= await client.get(
            GITHUB_USER_URL,
            headers= {
                "Authorization": f"Bearer {access_token}"
            }
        )
        user_data= user_response.json()
        print(f"✅ Successfully fetched profile for: {user_data.get('login')}")

    query= select(User).where(User.github_id == str(user_data["id"]))
    result= await db.execute(query)
    user= result.scalars().first()

    if user:
        user.username= user_data["login"]
        user.avatar_url= user_data["avatar_url"]
        user.email= user_data.get("email")
    else:
        user= User(
            github_id= str(user_data["id"]),
            username= user_data["login"],
            email= user_data.get("email"),
            avatar_url= user_data["avatar_url"]
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)
    
    jwt_token= create_access_token(
        data={"sub": str(user.id), "username": user.username}
    )

    # Redirect to frontend with token and user data
    params = urlencode({
        "token": jwt_token,
        "username": user.username,
        "avatar_url": user_data.get("avatar_url", ""),
        "user_id": str(user.id),
    })
    final_url = f"{FRONTEND_URL}/callback?{params}"
    print(f"🏁 Auth flow complete. Redirecting to: {FRONTEND_URL}/callback?token=***")
    return RedirectResponse(url=final_url)
