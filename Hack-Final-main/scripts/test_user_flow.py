import httpx

client = httpx.Client(timeout=10)

print("1. Logging in via backend...")
r = client.post("http://127.0.0.1:8000/api/v1/auth/login", json={"email": "shriyans.s.sahoo@gmail.com", "password": "password123"})
token = r.json().get("data", {}).get("access_token", "")
headers = {"Authorization": f"Bearer {token}"}
print(f"Token obtained: {bool(token)}")

print("\n2. Testing proxy on port 3000 (WITHOUT trailing slash):")
try:
    r_org = client.post("http://localhost:3000/api/v1/organizations", json={"name": "Proxy Org No Slash Test"}, headers=headers, follow_redirects=False)
    print(f"Status: {r_org.status_code}")
    print(f"Location Header: {r_org.headers.get('location', 'NONE')}")
    print(f"Response: {r_org.text[:200]}")
except Exception as e:
    print(f"Failed to connect: {e}")

client.close()
