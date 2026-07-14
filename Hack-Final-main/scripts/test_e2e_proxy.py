import httpx
import json

BASE_BACKEND = 'http://127.0.0.1:8000/api/v1'
BASE_FRONTEND = 'http://localhost:3000/api/v1'
client = httpx.Client(timeout=30)

results = []

def ok(name, passed, detail=""):
    status = "[PASS]" if passed else "[FAIL]"
    results.append((name, passed, detail))
    print(f"  {status} {name}" + (f" -- {detail}" if detail else ""))

print("=" * 65)
print("  NEUROPLANT FULL END-TO-END + PROXY TEST SUITE")
print("=" * 65)

# TEST 1: Backend direct health
print("\n[1] BACKEND HEALTH")
try:
    r = client.get("http://127.0.0.1:8000/health")
    ok("GET /health (backend direct)", r.status_code == 200, f"status={r.status_code}, body={r.text[:40]}")
except Exception as e:
    ok("GET /health (backend direct)", False, str(e))

# TEST 2: Backend auth login
print("\n[2] AUTHENTICATION")
token = ""
try:
    r = client.post(f"{BASE_BACKEND}/auth/login", json={"email": "admin@neuroplant.io", "password": "admin123"})
    d = r.json()
    token = d.get("data", {}).get("access_token", "")
    ok("POST /auth/login (admin) -- direct", r.status_code == 200 and bool(token), f"got_token={bool(token)}")
except Exception as e:
    ok("POST /auth/login (admin) -- direct", False, str(e))

headers = {"Authorization": f"Bearer {token}"}

# TEST 3: Auth bad password
try:
    r = client.post(f"{BASE_BACKEND}/auth/login", json={"email": "admin@neuroplant.io", "password": "wrong"})
    ok("POST /auth/login (bad password) -- 401", r.status_code == 401, f"status={r.status_code}")
except Exception as e:
    ok("POST /auth/login (bad password)", False, str(e))

# TEST 4: Frontend proxy - login
print("\n[3] FRONTEND PROXY CHAIN (/api/v1/* -> backend)")
token2 = ""
try:
    r = client.post(f"{BASE_FRONTEND}/auth/login", json={"email": "admin@neuroplant.io", "password": "admin123"})
    d = r.json()
    token2 = d.get("data", {}).get("access_token", "")
    ok("POST /auth/login -- via Next.js proxy", r.status_code == 200 and bool(token2), f"proxy_token={bool(token2)}")
except Exception as e:
    ok("POST /auth/login -- via Next.js proxy", False, str(e))

proxy_headers = {"Authorization": f"Bearer {token2}"}

# TEST 5: Proxy integrity contradictions
try:
    r = client.get(f"{BASE_FRONTEND}/integrity/contradictions", headers=proxy_headers)
    d = r.json()
    count = d.get("data", {}).get("count", 0)
    ok("GET /integrity/contradictions -- via proxy", r.status_code == 200, f"count={count}")
except Exception as e:
    ok("GET /integrity/contradictions -- via proxy", False, str(e))

# TEST 6: Proxy mortality score
try:
    r = client.get(f"{BASE_FRONTEND}/mortality/score", headers=proxy_headers)
    d = r.json()
    score = d.get("data", {}).get("mortality_score", "?")
    ok("GET /mortality/score -- via proxy", r.status_code == 200, f"score={score}")
except Exception as e:
    ok("GET /mortality/score -- via proxy", False, str(e))

# TEST 7: Proxy expert interview
try:
    r = client.post(f"{BASE_FRONTEND}/expert/interview/start",
                    json={"equipment_tag": "P-204", "context": "Cold weather startup"},
                    headers=proxy_headers)
    d = r.json()
    qs = len(d.get("data", {}).get("questions", []))
    ok("POST /expert/interview/start -- via proxy", r.status_code == 200, f"questions={qs}")
except Exception as e:
    ok("POST /expert/interview/start -- via proxy", False, str(e))

# TEST 8: Proxy integrity scan
try:
    r = client.post(f"{BASE_FRONTEND}/integrity/scan",
                    json={"org_id": "demo-org"},
                    headers=proxy_headers)
    d = r.json()
    status_val = d.get("data", {}).get("overall_status", "?")
    ok("POST /integrity/scan -- via proxy", r.status_code == 200, f"overall_status={status_val}")
except Exception as e:
    ok("POST /integrity/scan -- via proxy", False, str(e))

# TEST 9: Proxy decisions query
try:
    r = client.post(f"{BASE_FRONTEND}/decisions/query",
                    json={"question": "Why was pump P-204 isolated?", "org_id": "demo-org"},
                    headers=proxy_headers)
    d = r.json()
    intent = d.get("data", {}).get("intent", "?")
    ok("POST /decisions/query -- via proxy", r.status_code == 200, f"intent={intent}")
except Exception as e:
    ok("POST /decisions/query -- via proxy", False, str(e))

# TEST 10: Proxy document upload
try:
    r = client.post(f"{BASE_FRONTEND}/documents/upload",
                    headers=proxy_headers,
                    files={"file": ("test.txt", b"Pump P-204 isolation SOP content.", "text/plain")},
                    data={"process_after_upload": "false"})
    ok("POST /documents/upload -- via proxy", r.status_code == 201, f"status={r.status_code}")
except Exception as e:
    ok("POST /documents/upload -- via proxy", False, str(e))

# TEST 11: Proxy graph relationships
try:
    r = client.get(f"{BASE_FRONTEND}/graph/relationships", headers=proxy_headers)
    d = r.json()
    ok("GET /graph/relationships -- via proxy", r.status_code == 200, f"success={d.get('success')}")
except Exception as e:
    ok("GET /graph/relationships -- via proxy", False, str(e))

# TEST 12: Proxy dashboard alerts
try:
    r = client.get(f"{BASE_FRONTEND}/dashboard/alerts", headers=proxy_headers)
    d = r.json()
    total = d.get("data", {}).get("total", 0)
    ok("GET /dashboard/alerts -- via proxy", r.status_code == 200, f"total_alerts={total}")
except Exception as e:
    ok("GET /dashboard/alerts -- via proxy", False, str(e))

# TEST 13: Proxy regulatory drift
try:
    r = client.get(f"{BASE_FRONTEND}/integrity/regulatory-drift", headers=proxy_headers)
    d = r.json()
    drift = d.get("data", {}).get("drift_status", "?")
    ok("GET /integrity/regulatory-drift -- via proxy", r.status_code == 200, f"drift={drift}")
except Exception as e:
    ok("GET /integrity/regulatory-drift -- via proxy", False, str(e))

# TEST 14: RBAC - unauthenticated blocked at proxy
print("\n[4] SECURITY & RBAC via PROXY")
try:
    r = client.get(f"{BASE_FRONTEND}/admin/stats")
    ok("GET /admin/stats unauthenticated -- blocked 401", r.status_code == 401, f"status={r.status_code}")
except Exception as e:
    ok("GET /admin/stats unauthenticated -- blocked", False, str(e))

try:
    r = client.get(f"{BASE_FRONTEND}/integrity/scan")
    ok("GET /integrity/scan unauthenticated -- blocked 401", r.status_code in (401, 405), f"status={r.status_code}")
except Exception as e:
    ok("GET /integrity/scan unauthenticated", False, str(e))

try:
    r = client.get(f"{BASE_FRONTEND}/documents/", headers={"Authorization": "Bearer fake-token-xyz"})
    ok("GET /documents/ fake token -- blocked 401", r.status_code == 401, f"status={r.status_code}")
except Exception as e:
    ok("GET /documents/ fake token", False, str(e))

# TEST 15: Response envelope check
print("\n[5] RESPONSE ENVELOPE STRUCTURE")
try:
    r = client.get(f"{BASE_FRONTEND}/integrity/contradictions", headers=proxy_headers)
    env = r.json()
    has_envelope = all(k in env for k in ("success", "data", "timestamp"))
    ok("ResponseEnvelope has success/data/timestamp", has_envelope, f"keys={list(env.keys())[:4]}")
except Exception as e:
    ok("ResponseEnvelope structure", False, str(e))

# TEST 16: Graph labels schema validation
print("\n[6] KNOWLEDGE GRAPH SCHEMA VALIDATION")
try:
    r = client.get(f"{BASE_FRONTEND}/graph/labels", headers=proxy_headers)
    d = r.json()
    nl = len(d.get("data", {}).get("node_labels", []))
    rt = len(d.get("data", {}).get("relationship_types", []))
    ok("GET /graph/labels -- 13 nodes, 16 rel types", nl == 13 and rt == 16, f"node_labels={nl}, rel_types={rt}")
except Exception as e:
    ok("GET /graph/labels schema", False, str(e))

# TEST 17: Auth me endpoint
try:
    r = client.get(f"{BASE_FRONTEND}/auth/me", headers=proxy_headers)
    d = r.json()
    email = d.get("data", {}).get("email", "?")
    ok("GET /auth/me -- via proxy", r.status_code == 200, f"email={email}")
except Exception as e:
    ok("GET /auth/me -- via proxy", False, str(e))

# TEST 18: Knowledge mortality API
print("\n[7] KNOWLEDGE MORTALITY ENGINE")
try:
    r = client.get(f"{BASE_FRONTEND}/integrity/mortality", headers=proxy_headers)
    d = r.json()
    score = d.get("data", {}).get("mortality_score", "?")
    ok("GET /integrity/mortality -- via proxy", r.status_code == 200, f"score={score}")
except Exception as e:
    ok("GET /integrity/mortality -- via proxy", False, str(e))

# Summary
print()
print("=" * 65)
passed = sum(1 for _, p, _ in results if p)
failed = sum(1 for _, p, _ in results if not p)
total = len(results)
print(f"  FINAL RESULTS: {passed}/{total} PASSED | {failed} FAILED")
print("=" * 65)

if failed > 0:
    print("\n  FAILED TESTS:")
    for name, passed_val, detail in results:
        if not passed_val:
            print(f"    [FAIL] {name} -- {detail}")

client.close()
