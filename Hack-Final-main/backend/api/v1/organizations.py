"""Organization and Plant management routes."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user, require_role
from backend.core.security import Roles
from backend.database.session import get_db
from backend.schemas.common import ResponseEnvelope, PaginatedEnvelope, PaginatedResponse
from backend.schemas.organization import (
    OrganizationCreate, OrganizationUpdate, OrganizationRead,
    PlantCreate, PlantUpdate, PlantRead,
)
from backend.models.user import User
from backend.services.organization import organization_service
from backend.services.plant import plant_service

org_router = APIRouter(prefix="/organizations", tags=["Organizations"])
plant_router = APIRouter(prefix="/plants", tags=["Plants"])


# ── Organization Routes ──

@org_router.get("", response_model=PaginatedEnvelope[OrganizationRead])
async def list_organizations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_role(Roles.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    skip = (page - 1) * page_size
    items, total = await organization_service.list(db, skip=skip, limit=page_size)
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[OrganizationRead.model_validate(o) for o in items],
            total=total, page=page, page_size=page_size,
            total_pages=-(-total // page_size) if total > 0 else 0,
        )
    )


@org_router.get("/{org_id}", response_model=ResponseEnvelope[OrganizationRead])
async def get_organization(
    org_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    org = await organization_service.get_by_id_or_raise(db, org_id)
    return ResponseEnvelope(data=OrganizationRead.model_validate(org))


@org_router.post("", response_model=ResponseEnvelope[OrganizationRead], status_code=201)
async def create_organization(
    body: OrganizationCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    org = await organization_service.create_org(
        db, name=body.name, slug=body.slug,
        description=body.description, contact_email=body.contact_email,
    )
    if not current_user.organization_id:
        current_user.organization_id = org.id
        if current_user.role != Roles.SUPER_ADMIN:
            current_user.role = Roles.ORG_ADMIN
        await db.commit()
    return ResponseEnvelope(data=OrganizationRead.model_validate(org), message="Organization created")


@org_router.patch("/{org_id}", response_model=ResponseEnvelope[OrganizationRead])
async def update_organization(
    org_id: str,
    body: OrganizationUpdate,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    org = await organization_service.update(
        db, org_id,
        name=body.name, description=body.description,
        contact_email=body.contact_email, is_active=body.is_active,
    )
    return ResponseEnvelope(data=OrganizationRead.model_validate(org), message="Organization updated")


@org_router.delete("/{org_id}", response_model=ResponseEnvelope)
async def delete_organization(
    org_id: str,
    current_user: User = Depends(require_role(Roles.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    await organization_service.delete(db, org_id)
    return ResponseEnvelope(message="Organization deleted")


# ── Plant Routes ──

@plant_router.get("", response_model=PaginatedEnvelope[PlantRead])
async def list_plants(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    org_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    filters = {}
    target_org = org_id or current_user.organization_id
    if target_org:
        filters["organization_id"] = target_org
    skip = (page - 1) * page_size
    items, total = await plant_service.list(db, skip=skip, limit=page_size, filters=filters)
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[PlantRead.model_validate(p) for p in items],
            total=total, page=page, page_size=page_size,
            total_pages=-(-total // page_size) if total > 0 else 0,
        )
    )


@plant_router.get("/{plant_id}", response_model=ResponseEnvelope[PlantRead])
async def get_plant(
    plant_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    plant = await plant_service.get_by_id_or_raise(db, plant_id)
    return ResponseEnvelope(data=PlantRead.model_validate(plant))


@plant_router.post("", response_model=ResponseEnvelope[PlantRead], status_code=201)
async def create_plant(
    body: PlantCreate,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    plant = await plant_service.create_plant(
        db, name=body.name, code=body.code,
        organization_id=current_user.organization_id,
        location=body.location, description=body.description,
    )
    return ResponseEnvelope(data=PlantRead.model_validate(plant), message="Plant created")


@plant_router.patch("/{plant_id}", response_model=ResponseEnvelope[PlantRead])
async def update_plant(
    plant_id: str,
    body: PlantUpdate,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    plant = await plant_service.update(
        db, plant_id,
        name=body.name, code=body.code,
        location=body.location, description=body.description,
        is_active=body.is_active,
    )
    return ResponseEnvelope(data=PlantRead.model_validate(plant), message="Plant updated")


@plant_router.delete("/{plant_id}", response_model=ResponseEnvelope)
async def delete_plant(
    plant_id: str,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    await plant_service.delete(db, plant_id)
    return ResponseEnvelope(message="Plant deleted")
