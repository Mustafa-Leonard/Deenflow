from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    # In a real production app, you would decode the JWT and fetch the user from DB
    # For this skeleton, we assume the token is valid and return a mock user
    # Or implement actual JWT decoding if settings are provided
    from .models import UserMock # We'll need a mock or real User model
    return UserMock(id=1, email="user@example.com", is_staff=True)

async def require_admin(user=Depends(get_current_user)):
    if not getattr(user, "is_staff", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return user
