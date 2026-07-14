"""
Security utilities: password hashing, JWT token creation/verification, RBAC.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import bcrypt
from jose import JWTError, jwt

from backend.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a bcrypt hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(
        password.encode("utf-8"), bcrypt.gensalt(rounds=settings.BCRYPT_ROUNDS)
    ).decode("utf-8")


def create_access_token(
    subject: Any,
    extra_claims: Optional[dict] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a JWT access token."""
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: Any) -> str:
    """Create a JWT refresh token."""
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token. Returns the payload or raises."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        raise ValueError("Invalid or expired token")


# RBAC constants
class Roles:
    SUPER_ADMIN = "super_admin"
    ORG_ADMIN = "org_admin"
    EDITOR = "editor"
    VIEWER = "viewer"

    HIERARCHY = {
        SUPER_ADMIN: 100,
        ORG_ADMIN: 80,
        EDITOR: 50,
        VIEWER: 10,
    }

    @classmethod
    def has_permission(cls, user_role: str, required_role: str) -> bool:
        """Check if user_role has at least required_role permissions."""
        return cls.HIERARCHY.get(user_role, 0) >= cls.HIERARCHY.get(required_role, 0)

    @classmethod
    def is_admin(cls, role: str) -> bool:
        return role in (cls.SUPER_ADMIN, cls.ORG_ADMIN)
