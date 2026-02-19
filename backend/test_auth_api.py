import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_auth():
    print("--- Testing Registration ---")
    test_user = {
        "username": "tester",
        "email": "tester@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }
    
    # Cleanup if exists
    requests.post(f"{BASE_URL}/auth/register/", json=test_user) # might fail if exists, ignores
    
    print("--- Testing Login ---")
    login_data = {
        "username": "tester@example.com",
        "password": "testpassword123"
    }
    resp = requests.post(f"{BASE_URL}/auth/token/", json=login_data)
    if resp.status_code != 200:
        print(f"FAILED: Login failed with {resp.status_code}")
        print(resp.json())
        return

    tokens = resp.json()
    access_token = tokens['access']
    print("SUCCESS: Login successful, got access token")

    print("--- Testing Profile Fetch ---")
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
    if resp.status_code != 200:
        print(f"FAILED: Profile fetch failed with {resp.status_code}")
        print(resp.json())
        return
    
    profile = resp.json()
    print(f"SUCCESS: Profile fetched for {profile['email']}")

    print("--- Testing Mustafa Login ---")
    resp = requests.post(f"{BASE_URL}/auth/token/", json={
        "username": "mustafa@gmail.com",
        "password": "mustafa1"
    })
    if resp.status_code == 200:
        print("SUCCESS: Mustafa can log in")
    else:
        print(f"FAILED: Mustafa login failed: {resp.json()}")

    print("--- Testing Admin Login ---")
    resp = requests.post(f"{BASE_URL}/auth/token/", json={
        "username": "admin@deenflow.com",
        "password": "admin123"
    })
    if resp.status_code == 200:
        print("SUCCESS: Admin can log in")
    else:
        print(f"FAILED: Admin login failed: {resp.json()}")

if __name__ == "__main__":
    test_auth()
