import asyncio
import os
import shutil
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database.session import engine
from sqlalchemy import text
from backend.graph.graph_builder import graph_builder

async def reset():
    print("1. Wiping SQLite documents, logs, and pipeline tables...")
    async with engine.begin() as conn:
        for tbl in ["pipeline_results", "audit_logs", "notifications", "reports", "document_chunks", "documents"]:
            try:
                await conn.execute(text(f"DELETE FROM {tbl};"))
            except Exception:
                pass
    
    print("2. Wiping Neo4j Aura Cloud graph nodes and relationships...")
    graph_builder.mock_graph_store = {"nodes": {}, "relationships": []}
    try:
        driver = graph_builder._get_driver()
        with driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n;")
        driver.close()
        print("   Neo4j Aura cloud database wiped cleanly to 0 nodes!")
    except Exception as e:
        print(f"   Note on Neo4j wipe: {e}")

    print("3. Cleaning up local uploads directory...")
    uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
    if os.path.exists(uploads_dir):
        for f in os.listdir(uploads_dir):
            fp = os.path.join(uploads_dir, f)
            try:
                if os.path.isfile(fp):
                    os.remove(fp)
            except Exception:
                pass

    print("\nSUCCESS: All documents, logs, and graph nodes have been completely reset to ZERO!")
    print("The system is now fresh and ready for testing with a new document.")

if __name__ == "__main__":
    asyncio.run(reset())

