"""Organization & Plant schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, model_validator


class OrganizationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: Optional[str] = None
    description: Optional[str] = None
    contact_email: Optional[str] = None

    @model_validator(mode="after")
    def populate_slug(self) -> "OrganizationCreate":
        if not self.slug:
            import re
            cleaned = re.sub(r"[^a-z0-9-]+", "-", self.name.lower()).strip("-")
            self.slug = cleaned or "default-org"
        return self


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    contact_email: Optional[str] = None
    is_active: Optional[bool] = None


class OrganizationRead(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool
    contact_email: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PlantCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

    @model_validator(mode="after")
    def populate_code(self) -> "PlantCreate":
        if not self.code:
            import re
            cleaned = re.sub(r"[^A-Z0-9-]+", "-", self.name.upper()).strip("-")
            self.code = (cleaned or "PLANT")[:16]
        return self


class PlantUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class PlantRead(BaseModel):
    id: str
    name: str
    code: str
    location: Optional[str] = None
    description: Optional[str] = None
    is_active: bool
    organization_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
