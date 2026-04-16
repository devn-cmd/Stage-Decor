from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
import os
import hashlib
import secrets
from datetime import datetime, timedelta

from app.schemas import AdminLogin, TokenResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Simple admin password — in production, use environment variables
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "silkstage2024")

# Simple token store (in-memory for simplicity)
active_tokens: dict[str, datetime] = {}


def generate_token() -> str:
    """Generate a random auth token."""
    return secrets.token_hex(32)


def get_current_admin(authorization: Optional[str] = Header(None)) -> bool:
    """Dependency to verify admin authentication."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    token = authorization.replace("Bearer ", "")
    if token not in active_tokens:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # Check expiry (24 hours)
    if datetime.utcnow() > active_tokens[token]:
        del active_tokens[token]
        raise HTTPException(status_code=401, detail="Token expired")
    
    return True


@router.post("/login", response_model=TokenResponse)
def admin_login(login: AdminLogin):
    """Admin login with password."""
    if login.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    token = generate_token()
    active_tokens[token] = datetime.utcnow() + timedelta(hours=24)
    
    return TokenResponse(access_token=token)


@router.post("/verify")
def verify_token(admin: bool = Depends(get_current_admin)):
    """Verify if current token is valid."""
    return {"valid": True}
