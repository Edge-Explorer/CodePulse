from fastapi import APIRouter, HTTPException
from src.core.config import settings
import httpx
from fastapi.responses import RedirectResponse

router= APIRouter(prefix= "/auth", tags= ["Authentication"])

GITHUB_AUTH_URL= "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL= "https://github.com/login/oauth/access_token"
GITHUB_USER_URL= "https://api.github.com/user"

@router.get("/login")
async def login():
    """Step 1: Redirect user to GitHub's permission page"""
    url= f"{GITHUB_AUTH_URL}?client_id={settings.GITHUB_CLIENT_ID}&scope=user:email"
    return RedirectResponse(url)

@router.get("/github/callback")
async def github_callback(code: str):
    """Step 2 & 3: Exchange code for token and get user profile"""
    if not code:
        raise HTTPException(status_code= 400, detail= "Authorization code missing")

    async with httpx.AsyncClient() as client:
        # Exchange code for token
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
            raise HTTPException(status_code= 400, detail= "Failed to get the access token from GitHub")

        # Get User Profile
        user_response= await client.get(
            GITHUB_USER_URL,
            headers= {
                "Authorization": f"Bearer {access_token}"
            }
        )
        user_data= user_response.json()
    return {
        "message": "Successfully authenticated!",
        "github_user": user_data["login"],
        "email": user_data.get("email"),
        "avatar": user_data.get("avatar_url")
    }
