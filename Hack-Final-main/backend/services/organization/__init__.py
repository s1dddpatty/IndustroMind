"""Organization service."""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.exceptions import ConflictError
from backend.models.organization import Organization
from backend.services.base import BaseService


class OrganizationService(BaseService[Organization]):
    def __init__(self):
        super().__init__(Organization)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Organization]:
        result = await db.execute(select(Organization).where(Organization.slug == slug))
        return result.scalar_one_or_none()

    async def create_org(
        self, db: AsyncSession, name: str, slug: str,
        description: Optional[str] = None, contact_email: Optional[str] = None,
    ) -> Organization:
        existing = await self.get_by_slug(db, slug)
        if existing:
            raise ConflictError(f"Organization with slug '{slug}' already exists")
        return await self.create(
            db, name=name, slug=slug, description=description, contact_email=contact_email,
        )


organization_service = OrganizationService()
