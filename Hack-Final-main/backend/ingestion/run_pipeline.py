import sys
import os
import json
import argparse
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.ingestion.pipeline import ingestion_pipeline

def main():
    parser = argparse.ArgumentParser(description="Run standalone NeuroPlant Ingestion Pipeline (Bypasses Postgres/Auth)")
    parser.add_argument("--file", default="sample.pdf", help="Path to sample document file")
    parser.add_argument("--org-id", default="demo-org", help="Organization ID for tenant scoping")
    args = parser.parse_args()

    print(f"\n[*] [NeuroPlant Ingestion] Starting 14-Step Pipeline for file: '{args.file}' (Org: {args.org_id})...")

    # Run linear state machine
    now_ts = datetime.now(timezone.utc)
    result = ingestion_pipeline.run({
        "file_path": args.file,
        "org_id": args.org_id,
        "doc_id": f"doc_{now_ts.strftime('%Y%m%d%H%M%S')}"
    })

    # Build response payload matching Person 1, Person 3, Person 4 expectations
    payload = {
        "success": True,
        "data": {
            "document_metadata": result.get("metadata"),
            "classification": result.get("classification"),
            "extracted_entities": result.get("entities"),
            "extracted_relationships": result.get("relationships"),
            "integrity_scan_results": result.get("integrity_issues"),
            "processing_events": result.get("processing_events")  # Person 4 live visualization feed
        },
        "message": f"Successfully ingested {args.file} and populated Knowledge Graph.",
        "timestamp": now_ts.isoformat().replace("+00:00", "Z")
    }

    print("\n[SUCCESS] Ingestion Pipeline Execution Complete!\n")
    print("--- [Mock Output Envelope for Person 1 / Person 3 / Person 4] ---")
    print(json.dumps(payload, default=str, indent=2))
    print("-----------------------------------------------------------------\n")

if __name__ == "__main__":
    main()
