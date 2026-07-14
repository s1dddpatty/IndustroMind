import asyncio
import httpx
from backend.database.session import async_session_factory
from backend.models.user import User
from backend.core.security import hash_password
from sqlalchemy import select

async def reset_password():
    async with async_session_factory() as db:
        res = await db.execute(select(User).filter_by(email="admin@neuroplant.io"))
        user = res.scalar_one_or_none()
        if user:
            # Set password to "admin123"
            user.hashed_password = hash_password("admin123")
            await db.commit()
            print("Password updated successfully to 'admin123'")
        else:
            print("User admin@neuroplant.io not found!")

async def fetch_api():
    async with httpx.AsyncClient() as client:
        # Step 1: Login
        login_res = await client.post(
            "http://127.0.0.1:8000/api/v1/auth/login",
            json={"email": "admin@neuroplant.io", "password": "admin123"}
        )
        print("Login status:", login_res.status_code)
        if login_res.status_code != 200:
            print("Login failed:", login_res.text)
            return
        
        token = login_res.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Step 2: Fetch nodes
        nodes_res = await client.get("http://127.0.0.1:8000/api/v1/graph/nodes", headers=headers)
        print("Nodes status:", nodes_res.status_code)
        print("Nodes response:", nodes_res.json())
        
        # Step 3: Fetch relationships
        rels_res = await client.get("http://127.0.0.1:8000/api/v1/graph/relationships", headers=headers)
        print("Relationships status:", rels_res.status_code)
        print("Relationships response:", rels_res.json())

async def main():
    await reset_password()
    await fetch_api()

if __name__ == "__main__":
    asyncio.run(main())
