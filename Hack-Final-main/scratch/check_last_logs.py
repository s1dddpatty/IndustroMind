import asyncio
from backend.database.session import async_session_factory
from backend.models.audit_log import AuditLog
from sqlalchemy import select

async def main():
    async with async_session_factory() as db:
        res = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(10))
        for log in res.scalars():
            print(f"Action: {log.action}, Org: {log.organization_id}, Actor: {log.actor_id}, Details: {log.details}")

if __name__ == "__main__":
    asyncio.run(main())
