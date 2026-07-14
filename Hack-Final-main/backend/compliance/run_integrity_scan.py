import sys
import os
import json
import argparse
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.compliance.contradiction_detector import contradiction_detection_engine
from backend.compliance.regulatory_drift_engine import regulatory_drift_engine
from backend.decision.knowledge_mortality_engine import knowledge_mortality_engine
from backend.graph.graph_builder import graph_builder

def main():
    parser = argparse.ArgumentParser(description="Run standalone Knowledge Integrity Scan (Contradiction + Drift + Mortality)")
    parser.add_argument("--org-id", default="demo-org", help="Organization ID for tenant scoping")
    args = parser.parse_args()

    print(f"\n[*] [NeuroPlant Integrity Engine] Running full integrity scan for Org: '{args.org_id}'...")

    # Fetch mock nodes and relationships
    nodes_dict = graph_builder.mock_graph_store.get("nodes", {})
    nodes = list(nodes_dict.values())
    relationships = graph_builder.mock_graph_store.get("relationships", [])

    # Run 1: Contradiction Detection
    contradictions = contradiction_detection_engine.detect_contradictions(
        f"Organization {args.org_id} Assets", []
    )

    # Run 2: Regulatory Drift
    drift = regulatory_drift_engine.evaluate_drift(args.org_id, [], nodes, relationships)

    # Run 3: Knowledge Mortality Score
    mortality = knowledge_mortality_engine.calculate_mortality_score(args.org_id, nodes, relationships)

    now_ts = datetime.now(timezone.utc)
    # Consolidated envelope for Person 1 and Person 3
    payload = {
        "success": True,
        "data": {
            "org_id": args.org_id,
            "overall_integrity_status": "Attention Required",
            "contradiction_report": contradictions,
            "regulatory_drift_report": drift,
            "knowledge_mortality_report": mortality
        },
        "message": "Knowledge Integrity scan completed successfully.",
        "timestamp": now_ts.isoformat().replace("+00:00", "Z")
    }

    print("\n[SUCCESS] Knowledge Integrity Scan Complete!\n")
    print("--- [Consolidated Integrity Payload for Person 1 Alerts & Person 3 Dashboard] ---")
    print(json.dumps(payload, default=str, indent=2))
    print("---------------------------------------------------------------------------------\n")

if __name__ == "__main__":
    main()
