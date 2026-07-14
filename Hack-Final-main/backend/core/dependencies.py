"""
FastAPI dependency injection: database sessions, current user resolution, RBAC guards.
"""

from typing import Any, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import Roles, decode_token
from backend.database.session import get_db
from backend.models.user import User
from backend.services.user import user_service

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency that resolves the current authenticated user from the JWT."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_token(credentials.credentials)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = await user_service.get_by_id(db, user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensures the user account is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )
    return current_user


def require_role(required_role: str):
    """Factory for role-based access control dependency."""

    async def role_checker(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if not Roles.has_permission(current_user.role, required_role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{required_role}' or higher required",
            )
        return current_user

    return role_checker


def require_organization_access(allow_super_admin: bool = True):
    """
    Ensures the user has access to a given organization.
    To be used as a path operation dependency after path params are resolved.
    """

    async def org_checker(
        org_id: str,
        current_user: User = Depends(get_current_active_user),
    ) -> str:
        if current_user.role == Roles.SUPER_ADMIN and allow_super_admin:
            return org_id
        if current_user.organization_id != org_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access to this organization is not permitted",
            )
        return org_id

    return org_checker
