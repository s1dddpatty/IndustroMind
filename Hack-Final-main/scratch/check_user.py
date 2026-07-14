import asyncio
from backend.database.session import async_session_factory
from backend.models.user import User
from backend.models.organization import Organization
from sqlalchemy import select

async def main():
    async with async_session_factory() as db:
        user_res = await db.execute(select(User))
        for u in user_res.scalars():
            print(f"User: {u.id}, email: {u.email}, role: {u.role}, org_id: {u.organization_id}")
            
        org_res = await db.execute(select(Organization))
        for org in org_res.scalars():
            print(f"Org: {org.id}, name: {org.name}")

if __name__ == "__main__":
    asyncio.run(main())
