#!/usr/bin/env python
"""
Database setup script: creates all tables and runs initial seed.
Run: python -m scripts.setup_db
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv()

from backend.database.base import Base
from backend.database.session import engine


async def setup():
    print("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("All tables created successfully!")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(setup())
