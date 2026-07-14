"""Base CRUD service with common database operations."""
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar
from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.base import Base
from backend.core.exceptions import NotFoundError

ModelType = TypeVar("ModelType", bound=Base)


class BaseService(Generic[ModelType]):
    """Generic base service with common CRUD operations."""

    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get_by_id(self, db: AsyncSession, id: str) -> Optional[ModelType]:
        stmt = select(self.model).where(self.model.id == id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id_or_raise(self, db: AsyncSession, id: str) -> ModelType:
        obj = await self.get_by_id(db, id)
        if not obj:
            raise NotFoundError(self.model.__name__, id)
        return obj

    async def list(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None,
    ) -> tuple[List[ModelType], int]:
        stmt = select(self.model)
        count_stmt = select(func.count(self.model.id))

        if filters:
            for field, value in filters.items():
                column = getattr(self.model, field, None)
                if column is not None:
                    stmt = stmt.where(column == value)
                    count_stmt = count_stmt.where(column == value)

        # Total count
        count_result = await db.execute(count_stmt)
        total = count_result.scalar() or 0

        if order_by:
            col = getattr(self.model, order_by.lstrip("-"), None)
            if col:
                if order_by.startswith("-"):
                    stmt = stmt.order_by(col.desc())
                else:
                    stmt = stmt.order_by(col)

        stmt = stmt.offset(skip).limit(limit)
        result = await db.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def create(self, db: AsyncSession, **kwargs) -> ModelType:
        obj = self.model(**kwargs)
        db.add(obj)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def update(
        self, db: AsyncSession, id: str, **kwargs
    ) -> Optional[ModelType]:
        obj = await self.get_by_id_or_raise(db, id)
        for key, value in kwargs.items():
            if value is not None:
                setattr(obj, key, value)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def delete(self, db: AsyncSession, id: str) -> None:
        obj = await self.get_by_id_or_raise(db, id)
        await db.delete(obj)
        await db.flush()

    async def count(self, db: AsyncSession, filters: Optional[Dict[str, Any]] = None) -> int:
        stmt = select(func.count(self.model.id))
        if filters:
            for field, value in filters.items():
                column = getattr(self.model, field, None)
                if column is not None:
                    stmt = stmt.where(column == value)
        result = await db.execute(stmt)
        return result.scalar() or 0
