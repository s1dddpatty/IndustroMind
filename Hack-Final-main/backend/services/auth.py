"""Authentication service — login, register, token refresh."""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.exceptions import ConflictError, UnauthorizedError, ForbiddenError
from backend.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    Roles,
)
from backend.models.user import User
from backend.models.organization import Organization
from backend.schemas.auth import TokenResponse, RegisterRequest
from backend.services.user import user_service


class AuthService:
    async def register(
        self, db: AsyncSession, email: str, username: str, password: str,
        full_name: Optional[str] = None, organization_name: Optional[str] = None,
    ) -> TokenResponse:
        # Check existing user
        existing = await db.execute(
            select(User).where((User.email == email) | (User.username == username))
        )
        if existing.scalar_one_or_none():
            raise ConflictError("Email or username already registered")

        org_id = None
        if organization_name:
            slug = organization_name.lower().replace(" ", "-")
            org = Organization(name=organization_name, slug=slug)
            db.add(org)
            await db.flush()
            org_id = org.id

        user = User(
            email=email,
            username=username,
            hashed_password=hash_password(password),
            full_name=full_name,
            role=Roles.ORG_ADMIN,
            organization_id=org_id,
            is_verified=True,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)

        return TokenResponse(
            access_token=create_access_token(user.id, {"role": user.role, "org_id": org_id or ""}),
            refresh_token=create_refresh_token(user.id),
        )

    async def login(self, db: AsyncSession, email: str, password: str) -> TokenResponse:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedError("Invalid email or password")

        if not user.is_active:
            raise ForbiddenError("Account is inactive")

        return TokenResponse(
            access_token=create_access_token(
                user.id,
                {"role": user.role, "org_id": user.organization_id or ""},
            ),
            refresh_token=create_refresh_token(user.id),
        )

    async def refresh_token(self, db: AsyncSession, refresh_token: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token)
        except ValueError:
            raise UnauthorizedError("Invalid or expired refresh token")

        if payload.get("type") != "refresh":
            raise UnauthorizedError("Token is not a refresh token")

        user_id = payload.get("sub")
        user = await user_service.get_by_id(db, user_id)
        if not user or not user.is_active:
            raise UnauthorizedError("User not found or inactive")

        return TokenResponse(
            access_token=create_access_token(
                user.id,
                {"role": user.role, "org_id": user.organization_id or ""},
            ),
            refresh_token=create_refresh_token(user.id),
        )

    async def change_password(
        self, db: AsyncSession, user_id: str, current_password: str, new_password: str
    ) -> None:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not verify_password(current_password, user.hashed_password):
            raise UnauthorizedError("Current password is incorrect")

        user.hashed_password = hash_password(new_password)
        await db.flush()


auth_service = AuthService()
