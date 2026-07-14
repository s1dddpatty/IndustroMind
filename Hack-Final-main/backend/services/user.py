"""User service."""
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.security import hash_password
from backend.core.exceptions import ConflictError
from backend.models.user import User
from backend.services.base import BaseService


class UserService(BaseService[User]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def list_by_org(self, db: AsyncSession, org_id: str) -> List[User]:
        result = await db.execute(
            select(User).where(User.organization_id == org_id).order_by(User.created_at.desc())
        )
        return list(result.scalars().all())

    async def create_user(
        self, db: AsyncSession, email: str, username: str,
        password: str, full_name: Optional[str] = None,
        role: str = "viewer", organization_id: Optional[str] = None,
    ) -> User:
        existing = await db.execute(
            select(User).where((User.email == email) | (User.username == username))
        )
        if existing.scalar_one_or_none():
            raise ConflictError("Email or username already exists")

        return await self.create(
            db,
            email=email,
            username=username,
            hashed_password=hash_password(password),
            full_name=full_name,
            role=role,
            organization_id=organization_id,
        )


user_service = UserService()
