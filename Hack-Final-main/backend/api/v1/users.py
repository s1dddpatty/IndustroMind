"""User management routes."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user, require_role, require_organization_access
from backend.core.security import Roles
from backend.database.session import get_db
from backend.schemas.common import ResponseEnvelope, PaginatedEnvelope, PaginatedResponse
from backend.schemas.user import UserRead, UserCreate, UserUpdate, UserList
from backend.models.user import User
from backend.services.user import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=PaginatedEnvelope[UserList])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    org_id: Optional[str] = Query(None),
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    filters = {}
    if org_id:
        filters["organization_id"] = org_id
    elif current_user.organization_id:
        filters["organization_id"] = current_user.organization_id
    skip = (page - 1) * page_size
    items, total = await user_service.list(db, skip=skip, limit=page_size, filters=filters)
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[UserList.model_validate(u) for u in items],
            total=total, page=page, page_size=page_size,
            total_pages=-(-total // page_size) if total > 0 else 0,
        )
    )


@router.get("/{user_id}", response_model=ResponseEnvelope[UserRead])
async def get_user(
    user_id: str,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    user = await user_service.get_by_id_or_raise(db, user_id)
    return ResponseEnvelope(data=UserRead.model_validate(user))


@router.post("/", response_model=ResponseEnvelope[UserRead], status_code=201)
async def create_user(
    body: UserCreate,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    org_id = body.organization_id or current_user.organization_id
    user = await user_service.create_user(
        db, email=body.email, username=body.username,
        password=body.password, full_name=body.full_name,
        role=body.role, organization_id=org_id,
    )
    return ResponseEnvelope(data=UserRead.model_validate(user), message="User created")


@router.patch("/{user_id}", response_model=ResponseEnvelope[UserRead])
async def update_user(
    user_id: str,
    body: UserUpdate,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    user = await user_service.update(
        db, user_id,
        full_name=body.full_name, role=body.role, is_active=body.is_active,
    )
    return ResponseEnvelope(data=UserRead.model_validate(user), message="User updated")


@router.delete("/{user_id}", response_model=ResponseEnvelope)
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_role(Roles.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    await user_service.delete(db, user_id)
    return ResponseEnvelope(message="User deleted")
