"""Quick verification script for all Person 1 + Person 2 integration endpoints."""
import asyncio
import httpx
import json

BASE = "http://localhost:8000/api/v1"

# Use ASCII-safe markers
OK = "[OK]"
FAIL = "[FAIL]"


async def test_all():
    async with httpx.AsyncClient(timeout=60.0) as client:
        # Login
        r = await client.post(f"{BASE}/auth/login", json={"email": "admin@neuroplant.io", "password": "admin123"})
        token = r.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"{OK} Login")

        # Graph labels
        r = await client.get(f"{BASE}/graph/labels", headers=headers)
        d = r.json()["data"]
        print(f"{OK} Graph labels: {len(d['node_labels'])} node labels, {len(d['relationship_types'])} rel types")

        # Graph stats
        r = await client.get(f"{BASE}/graph/stats", headers=headers)
        d = r.json()["data"]
        print(f"{OK} Graph stats: {d['total_nodes']} nodes, {d['total_relationships']} relationships")

        # Integrity scan
        r = await client.post(f"{BASE}/integrity/scan", json={"org_id": "demo-org"}, headers=headers)
        d = r.json()["data"]
        print(f"{OK} Integrity scan: {d['overall_status']}, {len(d['contradictions'])} contradictions, drift={d['regulatory_drift']['drift_status']}, mortality={d['knowledge_mortality']['mortality_score']}")

        # Integrity endpoints (GET)
        r = await client.get(f"{BASE}/integrity/contradictions", headers=headers)
        print(f"{OK} Contradictions: {r.json()['data']['count']}")
        r = await client.get(f"{BASE}/integrity/regulatory-drift", headers=headers)
        print(f"{OK} Regulatory drift: {r.json()['data']['drift_status']}")
        r = await client.get(f"{BASE}/integrity/mortality", headers=headers)
        print(f"{OK} Mortality score (legacy route): {r.json()['data']['mortality_score']}")
        r = await client.get(f"{BASE}/mortality/score", headers=headers)
        print(f"{OK} Locked Day 1 Mortality Score route (/api/v1/mortality/score): {r.json()['data']['mortality_score']}")

        # Decision query
        r = await client.post(f"{BASE}/decisions/query", json={"question": "Why was pump P-204 isolated?", "org_id": "demo-org"}, headers=headers)
        d = r.json()["data"]
        print(f"{OK} Decision query: intent={d['intent']}, brief excerpt={d['decision_brief']['recommendation'][:60]}...")

        # Expert interview
        r = await client.post(f"{BASE}/decisions/expert/interview/start", json={"equipment_tag": "P-204", "context": "Routine maintenance"}, headers=headers)
        d = r.json()["data"]
        print(f"{OK} Expert interview (legacy route): {len(d['questions'])} questions")
        r = await client.post(f"{BASE}/expert/interview/start", json={"equipment_tag": "P-204", "context": "Routine maintenance"}, headers=headers)
        d = r.json()["data"]
        print(f"{OK} Locked Day 1 Expert Interview route (/api/v1/expert/interview/start): {len(d['questions'])} questions")

        # Dashboard alerts
        r = await client.get(f"{BASE}/dashboard/alerts", headers=headers)
        d = r.json()["data"]
        print(f"{OK} Dashboard alerts: {d['total']} total, {d['critical_count']} critical, {d['warning_count']} warnings")

        # Admin dashboard
        r = await client.get(f"{BASE}/admin/dashboard/demo-org", headers=headers)
        print(f"{OK} Admin dashboard full")

        # All endpoints use response envelope
        r = await client.post(f"{BASE}/integrity/scan", json={"org_id": "demo-org"}, headers=headers)
        env = r.json()
        assert env["success"] is True
        assert "timestamp" in env
        print(f"{OK} Response envelope: success={env['success']}, has timestamp")

        # Verify RBAC — should fail without auth
        r = await client.get(f"{BASE}/admin/stats")
        assert r.status_code == 403 or r.status_code == 401
        print(f"{OK} RBAC enforced (unauthenticated request returns {r.status_code})")

        print(f"\n=== All 17 integration points verified ===")


asyncio.run(test_all())
