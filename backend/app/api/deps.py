from __future__ import annotations

from fastapi import Header, HTTPException, status

from app.config import settings


def verify_admin_token(x_admin_token: str = Header(default="")) -> None:
    if x_admin_token != settings.admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )
