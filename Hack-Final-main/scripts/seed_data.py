#!/usr/bin/env python
"""
Seed script: creates default admin user, demo organization, and sample data.
Run: python -m scripts.seed_data
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.base import Base
from backend.database.session import engine, async_session_factory
from backend.core.security import hash_password, Roles
import backend.models  # noqa: F401 registers all models on Base.metadata
from backend.models.user import User
from backend.models.role import Role
from backend.models.organization import Organization, Plant


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as db:
        # Check if already seeded
        from sqlalchemy import select
        result = await db.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping.")
            await db.close()
            await engine.dispose()
            return

        # Create demo org
        org = Organization(
            name="Demo Organization",
            slug="demo-org",
            description="Demo organization for hackathon",
            contact_email="admin@demo.org",
        )
        db.add(org)
        await db.flush()

        # Create plants
        plants = [
            Plant(name="Unit 1 - Processing", code="UNIT-01", location="Building A",
                  description="Main processing unit", organization_id=org.id),
            Plant(name="Unit 2 - Refining", code="UNIT-02", location="Building B",
                  description="Refining and distillation", organization_id=org.id),
            Plant(name="Unit 3 - Utilities", code="UNIT-03", location="Building C",
                  description="Steam and power generation", organization_id=org.id),
        ]
        for p in plants:
            db.add(p)
        await db.flush()

        # Create mandatory locked roles
        role_names = [
            "Organization Administrator", "Plant Manager", "Maintenance Engineer",
            "Compliance Officer", "Safety Officer", "Field Technician",
            "Subject Matter Expert", "External Auditor"
        ]
        for r_name in role_names:
            db.add(Role(name=r_name, description=f"Locked role: {r_name}", organization_id=org.id))
        await db.flush()

        # Create users
        users = [
            User(
                email="admin@neuroplant.io",
                username="admin",
                hashed_password=hash_password("admin123"),
                full_name="System Admin",
                role=Roles.SUPER_ADMIN,
                is_active=True,
                is_verified=True,
            ),
            User(
                email="orgadmin@demo.org",
                username="orgadmin",
                hashed_password=hash_password("admin123"),
                full_name="Org Admin",
                role=Roles.ORG_ADMIN,
                is_active=True,
                is_verified=True,
                organization_id=org.id,
            ),
            User(
                email="editor@demo.org",
                username="editor",
                hashed_password=hash_password("editor123"),
                full_name="Demo Editor",
                role=Roles.EDITOR,
                is_active=True,
                is_verified=True,
                organization_id=org.id,
            ),
            User(
                email="viewer@demo.org",
                username="viewer",
                hashed_password=hash_password("viewer123"),
                full_name="Demo Viewer",
                role=Roles.VIEWER,
                is_active=True,
                is_verified=True,
                organization_id=org.id,
            ),
        ]
        for u in users:
            db.add(u)

        await db.commit()
        print("Database seeded successfully!")
        print(f"  Org: {org.name} (slug: {org.slug})")
        print(f"  Plants: {[p.code for p in plants]}")
        print(f"  Users: admin@neuroplant.io/admin123, orgadmin@demo.org/admin123, editor@demo.org/editor123, viewer@demo.org/viewer123")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
