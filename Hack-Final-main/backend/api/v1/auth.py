"""Authentication routes — register, login, refresh, change password."""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user
from backend.database.session import get_db
from backend.schemas.auth import (
    LoginRequest, RegisterRequest, RefreshRequest, TokenResponse,
    PasswordChangeRequest,
)
from backend.schemas.common import ResponseEnvelope
from backend.schemas.user import UserRead
from backend.models.user import User
from backend.services.auth import auth_service
from backend.services.audit import audit_log_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=ResponseEnvelope[TokenResponse])
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await auth_service.register(
        db, email=body.email, username=body.username,
        password=body.password, full_name=body.full_name,
        organization_name=body.organization_name,
    )
    return ResponseEnvelope(data=result, message="Registration successful")


@router.post("/login", response_model=ResponseEnvelope[TokenResponse])
async def login(body: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    result = await auth_service.login(db, email=body.email, password=body.password)
    return ResponseEnvelope(data=result, message="Login successful")


@router.post("/refresh", response_model=ResponseEnvelope[TokenResponse])
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    result = await auth_service.refresh_token(db, body.refresh_token)
    return ResponseEnvelope(data=result, message="Token refreshed")


@router.post("/change-password", response_model=ResponseEnvelope)
async def change_password(
    body: PasswordChangeRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    await auth_service.change_password(
        db, current_user.id, body.current_password, body.new_password,
    )
    return ResponseEnvelope(message="Password changed successfully")


@router.get("/me", response_model=ResponseEnvelope[UserRead])
async def get_me(current_user: User = Depends(get_current_active_user)):
    return ResponseEnvelope(data=UserRead.model_validate(current_user))
