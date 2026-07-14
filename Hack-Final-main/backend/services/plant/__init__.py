"""Plant service."""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.exceptions import ConflictError
from backend.models.organization import Plant
from backend.services.base import BaseService


class PlantService(BaseService[Plant]):
    def __init__(self):
        super().__init__(Plant)

    async def get_by_code(self, db: AsyncSession, code: str, org_id: str) -> Optional[Plant]:
        result = await db.execute(
            select(Plant).where(Plant.code == code, Plant.organization_id == org_id)
        )
        return result.scalar_one_or_none()

    async def list_by_org(self, db: AsyncSession, org_id: str, skip: int = 0, limit: int = 100):
        return await self.list(db, skip=skip, limit=limit, filters={"organization_id": org_id})

    async def create_plant(
        self, db: AsyncSession, name: str, code: str,
        organization_id: str, location: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Plant:
        existing = await self.get_by_code(db, code, organization_id)
        if existing:
            raise ConflictError(f"Plant with code '{code}' already exists in this organization")
        return await self.create(
            db, name=name, code=code, organization_id=organization_id,
            location=location, description=description,
        )


plant_service = PlantService()
