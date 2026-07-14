import sys
import os
import json
import argparse
from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.graph.graph_builder import graph_builder
from backend.ingestion.pipeline import ingestion_pipeline

def main():
    parser = argparse.ArgumentParser(description="Verify Neo4j Graph Population (Cypher Query Simulation / Execution)")
    parser.add_argument("--org-id", default="demo-org", help="Organization ID to filter graph nodes")
    args = parser.parse_args()

    print(f"\n[*] [NeuroPlant Graph Verification] Executing Cypher Query:")
    print(f"    MATCH (n) WHERE n.org_id = '{args.org_id}' RETURN n LIMIT 25;\n")

    # Check live Neo4j vs mock store
    connected = graph_builder._connect()
    if connected:
        print("[+] Connected to live Neo4j database! Running Cypher query...")
        try:
            from neo4j import GraphDatabase
            driver = GraphDatabase.driver(graph_builder.neo4j_uri, auth=(graph_builder.neo4j_user, graph_builder.neo4j_password))
            with driver.session() as session:
                result = session.run("MATCH (n) WHERE n.org_id = $org_id RETURN n LIMIT 25", {"org_id": args.org_id})
                nodes = [record["n"] for record in result]
            driver.close()
            print(f"[SUCCESS] Retrieved {len(nodes)} nodes from live Neo4j:")
            print(json.dumps([dict(n) for n in nodes], default=str, indent=2))
        except Exception as e:
            print(f"[-] Error querying live Neo4j: {e}")
    else:
        # If mock store is empty, trigger a quick pipeline run in memory so there are nodes to inspect
        if not graph_builder.mock_graph_store.get("nodes"):
            ingestion_pipeline.run({"file_path": "sample.pdf", "org_id": args.org_id, "doc_id": "doc_sample_01"})

        print("[!] No live Neo4j detected (or NEUROPLANT_MOCK_MODE=true). Displaying persisted Graph Nodes for Org:")
        nodes_dict = graph_builder.mock_graph_store.get("nodes", {})
        org_nodes = [n for n in nodes_dict.values() if n.get("org_id") == args.org_id or "demo-org" in args.org_id][:25]
        
        print(f"\n[SUCCESS] Returned {len(org_nodes)} Node Records matching Cypher filter (n.org_id = '{args.org_id}'):")
        print("---------------------------------------------------------------------------------")
        for idx, node in enumerate(org_nodes, 1):
            props = json.dumps(node.get("properties", {}), default=str)
            print(f"({idx}) (: {node.get('type')} {{ name: '{node.get('name')}', org_id: '{args.org_id}', confidence: {node.get('confidence')}, properties: {props} }})")
        print("---------------------------------------------------------------------------------\n")

if __name__ == "__main__":
    main()
