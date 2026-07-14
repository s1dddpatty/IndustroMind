import asyncio
from backend.database.session import async_session_factory
from backend.services.processing import processing_service

async def main():
    nodes = await processing_service.get_graph_nodes("49ed1de9-090e-476d-8f5e-6e1a6e74aa9a")
    rels = await processing_service.get_graph_relationships("49ed1de9-090e-476d-8f5e-6e1a6e74aa9a")
    
    print(f"Total nodes: {len(nodes)}")
    for i, n in enumerate(nodes):
        print(f"Node {i}: name={n.get('name')}, type={n.get('type')}, org_id={n.get('org_id')}")
        
    print(f"\nTotal relationships: {len(rels)}")
    for i, r in enumerate(rels):
        print(f"Rel {i}: source={r.get('source_entity_name')}, target={r.get('target_entity_name')}, type={r.get('relationship_type')}")

if __name__ == "__main__":
    asyncio.run(main())
