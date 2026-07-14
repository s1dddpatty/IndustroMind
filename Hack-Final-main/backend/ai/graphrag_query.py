import sys
import os
import json
import argparse
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.agents.graphrag_retrieval import graphrag_retrieval_agent
from backend.decision.decision_brief_generator import decision_brief_generator

def main():
    parser = argparse.ArgumentParser(description="Run standalone GraphRAG Query & Decision Brief Generation")
    parser.add_argument("--question", default="Why was Pump P-204 isolated last quarter?", help="Natural language operational query")
    parser.add_argument("--org-id", default="demo-org", help="Organization ID for tenant scoping")
    args = parser.parse_args()

    print(f"\n[*] [NeuroPlant GraphRAG] Processing Query: '{args.question}' (Org: {args.org_id})...")

    # Step 1: Retrieval (Intent -> Entity -> Graph Traversal -> Semantic Search)
    retrieved_context = graphrag_retrieval_agent.retrieve_context(args.question, args.org_id)

    # Step 2: Decision Brief Generation
    brief = decision_brief_generator.generate_brief(args.question, retrieved_context)

    now_ts = datetime.now(timezone.utc)
    # Output envelope for Person 3 UI
    payload = {
        "success": True,
        "data": {
            "query": args.question,
            "retrieved_context_summary": {
                "intent": retrieved_context.get("intent"),
                "entities_detected": retrieved_context.get("detected_entities")
            },
            "decision_brief": brief
        },
        "message": "Decision Brief generated successfully.",
        "timestamp": now_ts.isoformat().replace("+00:00", "Z")
    }

    print("\n[SUCCESS] GraphRAG Query Execution Complete!\n")
    print("--- [Structured Decision Brief Envelope for Person 3 Decision Assistant UI] ---")
    print(json.dumps(payload, default=str, indent=2))
    print("---------------------------------------------------------------------------------\n")

if __name__ == "__main__":
    main()
