
import requests
import json

BASE_URL = "http://localhost:8000/api"

# We'll need a token for some endpoints, but let's check public/read-only ones first
# or assume we're testing on a local dev environment where we can bypass or have a test user.
# For now, let's just check if the endpoints return 200/401 (meaning they exist and are routed)

endpoints = [
    "/prayer/times/",
    "/prayer/location/",
    "/dhikr/",
    "/duas/",
    "/reminders/",
    "/asmaul-husna/",
    "/favorites/",
    "/worship/categories/",
]

def test_endpoints():
    print("Testing Worship Module API Endpoints...")
    for ep in endpoints:
        try:
            # Most of these require authentication, so we expect 401 Unauthorized if no token is provided.
            # 404 would mean the route is missing.
            # 405 would mean the method is not allowed.
            response = requests.get(BASE_URL + ep)
            status = response.status_code
            if status in [200, 401, 400]: # 400 is expected for prayer/times if location is not set
                print(f"[OK] {ep} returned {status}")
            else:
                print(f"[ERROR] {ep} returned {status}")
        except Exception as e:
            print(f"[FAIL] {ep} failed: {str(e)}")

if __name__ == "__main__":
    test_endpoints()
