#!/usr/bin/env python
"""
FULL BACKEND TEST SUITE — Person 1 + Person 2 Combined Testing
Tests every endpoint category: Auth, CRUD, AI Pipeline, Graph, Integrity, Decisions, Dashboard, RBAC
"""
import httpx
import json
import sys
import traceback

BASE = "http://localhost:8000/api/v1"
OK = "[PASS]"
FAIL = "[FAIL]"
SKIP = "[SKIP]"

results = []

def record(name, passed, detail=""):
    status = OK if passed else FAIL
    results.append({"name": name, "passed": passed, "detail": detail})
    print(f"  {status} {name}" + (f" — {detail}" if detail else ""))

def main():
    client = httpx.Client(timeout=60.0)
    token = None
    headers = {}

    print("=" * 70)
    print("  NEUROPLANT BACKEND — FULL INTEGRATION TEST SUITE")
    print("=" * 70)

    # ─────────────────────────────────────────────
    # SECTION 1: HEALTH CHECK
    # ─────────────────────────────────────────────
    print("\n[1/10] HEALTH CHECK")
    try:
        r = client.get("http://localhost:8000/health")
        record("GET /health", r.status_code == 200, f"status={r.status_code}")
    except Exception as e:
        record("GET /health", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 2: AUTHENTICATION (P1)
    # ─────────────────────────────────────────────
    print("\n[2/10] AUTHENTICATION (Person 1)")
    try:
        r = client.post(f"{BASE}/auth/login", json={"email": "admin@neuroplant.io", "password": "admin123"})
        login_ok = r.status_code == 200 and r.json().get("data", {}).get("access_token")
        if login_ok:
            token = r.json()["data"]["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
        record("POST /auth/login (admin)", login_ok, f"got token={bool(token)}")
    except Exception as e:
        record("POST /auth/login (admin)", False, str(e))

    try:
        r = client.post(f"{BASE}/auth/login", json={"email": "admin@neuroplant.io", "password": "wrongpassword"})
        record("POST /auth/login (bad password)", r.status_code in (401, 403), f"status={r.status_code}")
    except Exception as e:
        record("POST /auth/login (bad password)", False, str(e))

    try:
        r = client.get(f"{BASE}/auth/me", headers=headers)
        me_ok = r.status_code == 200
        email = r.json().get("data", {}).get("email", "?") if me_ok else "?"
        record("GET /auth/me", me_ok, f"email={email}")
    except Exception as e:
        record("GET /auth/me", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 3: USERS & ORGS CRUD (P1)
    # ─────────────────────────────────────────────
    print("\n[3/10] USERS & ORGANIZATIONS CRUD (Person 1)")
    try:
        r = client.get(f"{BASE}/users/", headers=headers)
        user_count = len(r.json().get("data", {}).get("items", []))
        record("GET /users/ (list)", r.status_code == 200, f"users={user_count}")
    except Exception as e:
        record("GET /users/ (list)", False, str(e))

    try:
        r = client.get(f"{BASE}/organizations/", headers=headers)
        org_count = len(r.json().get("data", {}).get("items", []))
        record("GET /organizations/ (list)", r.status_code == 200, f"orgs={org_count}")
    except Exception as e:
        record("GET /organizations/ (list)", False, str(e))

    try:
        r = client.get(f"{BASE}/plants/", headers=headers)
        plant_count = len(r.json().get("data", {}).get("items", []))
        record("GET /plants/ (list)", r.status_code == 200, f"plants={plant_count}")
    except Exception as e:
        record("GET /plants/ (list)", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 4: DOCUMENT UPLOAD & STATUS (P1+P2)
    # ─────────────────────────────────────────────
    print("\n[4/10] DOCUMENT UPLOAD & STATUS (Person 1 + Person 2 Pipeline)")
    doc_id = None
    try:
        files = {"file": ("test_procedure.txt", b"Standard Operating Procedure for Pump P-204 Isolation.", "text/plain")}
        data = {"organization_id": "demo-org", "process_after_upload": "false"}
        r = client.post(f"{BASE}/documents/upload", headers=headers, files=files, data=data)
        upload_ok = r.status_code == 201
        if upload_ok:
            doc_id = r.json()["data"]["id"]
        record("POST /documents/upload", upload_ok, f"doc_id={doc_id}, status={r.status_code}")
    except Exception as e:
        record("POST /documents/upload", False, str(e))

    try:
        r = client.get(f"{BASE}/documents/", headers=headers)
        doc_count = r.json().get("data", {}).get("total", 0)
        record("GET /documents/ (list)", r.status_code == 200, f"total={doc_count}")
    except Exception as e:
        record("GET /documents/ (list)", False, str(e))

    if doc_id:
        try:
            r = client.get(f"{BASE}/documents/{doc_id}", headers=headers)
            record("GET /documents/{id}", r.status_code == 200, f"file={r.json().get('data',{}).get('file_name','?')}")
        except Exception as e:
            record("GET /documents/{id}", False, str(e))

        try:
            r = client.get(f"{BASE}/documents/{doc_id}/status", headers=headers)
            record("GET /documents/{id}/status", r.status_code == 200, f"pipeline status retrieved")
        except Exception as e:
            record("GET /documents/{id}/status", False, str(e))

        try:
            r = client.get(f"{BASE}/documents/{doc_id}/pipeline", headers=headers)
            record("GET /documents/{id}/pipeline", r.status_code == 200, f"pipeline progress retrieved")
        except Exception as e:
            record("GET /documents/{id}/pipeline", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 5: KNOWLEDGE GRAPH (P2)
    # ─────────────────────────────────────────────
    print("\n[5/10] KNOWLEDGE GRAPH (Person 2)")
    try:
        r = client.get(f"{BASE}/graph/labels", headers=headers)
        d = r.json().get("data", {})
        nl = len(d.get("node_labels", []))
        rt = len(d.get("relationship_types", []))
        record("GET /graph/labels", r.status_code == 200 and nl == 13 and rt == 16, f"node_labels={nl}, rel_types={rt}")
    except Exception as e:
        record("GET /graph/labels", False, str(e))

    try:
        r = client.get(f"{BASE}/graph/stats", headers=headers)
        d = r.json().get("data", {})
        record("GET /graph/stats", r.status_code == 200, f"nodes={d.get('total_nodes',0)}, rels={d.get('total_relationships',0)}")
    except Exception as e:
        record("GET /graph/stats", False, str(e))

    try:
        r = client.get(f"{BASE}/graph/nodes", headers=headers)
        record("GET /graph/nodes", r.status_code == 200, f"count={r.json().get('data',{}).get('count',0)}")
    except Exception as e:
        record("GET /graph/nodes", False, str(e))

    try:
        r = client.get(f"{BASE}/graph/relationships", headers=headers)
        record("GET /graph/relationships", r.status_code == 200, f"count={r.json().get('data',{}).get('count',0)}")
    except Exception as e:
        record("GET /graph/relationships", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 6: INTEGRITY & COMPLIANCE (P2)
    # ─────────────────────────────────────────────
    print("\n[6/10] INTEGRITY & COMPLIANCE (Person 2)")
    try:
        r = client.post(f"{BASE}/integrity/scan", json={"org_id": "demo-org"}, headers=headers)
        d = r.json().get("data", {})
        record("POST /integrity/scan", r.status_code == 200,
               f"status={d.get('overall_status')}, contradictions={len(d.get('contradictions',[]))}, drift={d.get('regulatory_drift',{}).get('drift_status')}, mortality={d.get('knowledge_mortality',{}).get('mortality_score')}")
    except Exception as e:
        record("POST /integrity/scan", False, str(e))

    try:
        r = client.get(f"{BASE}/integrity/contradictions", headers=headers)
        record("GET /integrity/contradictions", r.status_code == 200, f"count={r.json().get('data',{}).get('count',0)}")
    except Exception as e:
        record("GET /integrity/contradictions", False, str(e))

    try:
        r = client.get(f"{BASE}/integrity/regulatory-drift", headers=headers)
        record("GET /integrity/regulatory-drift", r.status_code == 200, f"drift={r.json().get('data',{}).get('drift_status','?')}")
    except Exception as e:
        record("GET /integrity/regulatory-drift", False, str(e))

    try:
        r = client.get(f"{BASE}/integrity/mortality", headers=headers)
        record("GET /integrity/mortality", r.status_code == 200, f"score={r.json().get('data',{}).get('mortality_score','?')}")
    except Exception as e:
        record("GET /integrity/mortality", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 7: LOCKED DAY 1 CONTRACT ENDPOINTS
    # ─────────────────────────────────────────────
    print("\n[7/10] LOCKED DAY 1 SHARED CONTRACTS (PLAN.pdf)")
    try:
        r = client.get(f"{BASE}/mortality/score", headers=headers)
        record("GET /mortality/score (LOCKED)", r.status_code == 200, f"score={r.json().get('data',{}).get('mortality_score','?')}")
    except Exception as e:
        record("GET /mortality/score (LOCKED)", False, str(e))

    try:
        r = client.post(f"{BASE}/expert/interview/start", json={"equipment_tag": "P-204", "context": "Routine maintenance"}, headers=headers)
        d = r.json().get("data", {})
        record("POST /expert/interview/start (LOCKED)", r.status_code == 200, f"questions={len(d.get('questions',[]))}")
    except Exception as e:
        record("POST /expert/interview/start (LOCKED)", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 8: DECISIONS & EXPERT INTERVIEW (P2)
    # ─────────────────────────────────────────────
    print("\n[8/10] DECISIONS & EXPERT INTERVIEW (Person 2)")
    try:
        r = client.post(f"{BASE}/decisions/query", json={"question": "Why was pump P-204 isolated?", "org_id": "demo-org"}, headers=headers)
        d = r.json().get("data", {})
        intent = d.get("intent", "?")
        brief = d.get("decision_brief", {}).get("recommendation", "?")[:60]
        record("POST /decisions/query", r.status_code == 200, f"intent={intent}, brief={brief}...")
    except Exception as e:
        record("POST /decisions/query", False, str(e))

    try:
        r = client.post(f"{BASE}/decisions/expert/interview/start", json={"equipment_tag": "P-204", "context": "Routine maintenance"}, headers=headers)
        d = r.json().get("data", {})
        record("POST /decisions/expert/interview/start", r.status_code == 200, f"questions={len(d.get('questions',[]))}")
    except Exception as e:
        record("POST /decisions/expert/interview/start", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 9: DASHBOARD & ADMIN (P1)
    # ─────────────────────────────────────────────
    print("\n[9/10] DASHBOARD & ADMIN (Person 1)")
    try:
        r = client.get(f"{BASE}/dashboard/alerts", headers=headers)
        d = r.json().get("data", {})
        record("GET /dashboard/alerts", r.status_code == 200, f"total={d.get('total',0)}, critical={d.get('critical_count',0)}")
    except Exception as e:
        record("GET /dashboard/alerts", False, str(e))

    try:
        r = client.get(f"{BASE}/admin/dashboard/demo-org", headers=headers)
        record("GET /admin/dashboard/{org_id}", r.status_code == 200, "admin dashboard loaded")
    except Exception as e:
        record("GET /admin/dashboard/{org_id}", False, str(e))

    try:
        r = client.get(f"{BASE}/admin/stats", headers=headers)
        record("GET /admin/stats", r.status_code == 200, "admin stats loaded")
    except Exception as e:
        record("GET /admin/stats", False, str(e))

    # ─────────────────────────────────────────────
    # SECTION 10: RBAC & SECURITY (P1)
    # ─────────────────────────────────────────────
    print("\n[10/10] RBAC & SECURITY (Person 1)")
    try:
        r = client.get(f"{BASE}/admin/stats")
        record("Unauthenticated -> /admin/stats", r.status_code in (401, 403), f"blocked with {r.status_code}")
    except Exception as e:
        record("Unauthenticated -> /admin/stats", False, str(e))

    try:
        r = client.get(f"{BASE}/documents/", headers={"Authorization": "Bearer fake-token"})
        record("Invalid token -> /documents/", r.status_code in (401, 403), f"blocked with {r.status_code}")
    except Exception as e:
        record("Invalid token -> /documents/", False, str(e))

    try:
        r = client.post(f"{BASE}/integrity/scan", json={"org_id": "demo-org"})
        record("Unauthenticated -> /integrity/scan", r.status_code in (401, 403), f"blocked with {r.status_code}")
    except Exception as e:
        record("Unauthenticated -> /integrity/scan", False, str(e))

    # Check ResponseEnvelope structure
    try:
        r = client.post(f"{BASE}/integrity/scan", json={"org_id": "demo-org"}, headers=headers)
        env = r.json()
        has_envelope = all(k in env for k in ("success", "data", "timestamp"))
        record("ResponseEnvelope structure", has_envelope, f"success={env.get('success')}, has_timestamp={'timestamp' in env}")
    except Exception as e:
        record("ResponseEnvelope structure", False, str(e))

    # ─────────────────────────────────────────────
    # SUMMARY
    # ─────────────────────────────────────────────
    print("\n" + "=" * 70)
    passed = sum(1 for r in results if r["passed"])
    failed = sum(1 for r in results if not r["passed"])
    total = len(results)
    print(f"  RESULTS: {passed}/{total} PASSED, {failed} FAILED")
    print("=" * 70)

    if failed > 0:
        print("\n  FAILED TESTS:")
        for r in results:
            if not r["passed"]:
                print(f"    {FAIL} {r['name']} — {r['detail']}")

    client.close()
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
