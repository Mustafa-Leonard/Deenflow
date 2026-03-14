import requests

BASE = 'http://127.0.0.1:9000/api'
endpoints = [
    '/worship/prayer/times/',
    '/worship/dhikr/',
    '/worship/duas/',
    '/worship/reminders/',
    '/worship/asmaul-husna/',
    '/worship/favorites/',
    '/worship/categories/',
]

print("Testing Worship API Endpoints...\n")
for ep in endpoints:
    try:
        r = requests.get(BASE + ep, timeout=5)
        ok = r.status_code in [200, 401, 400]
        label = "OK" if ok else "ERROR"
        print(f"[{label}] {ep} => HTTP {r.status_code}")
    except Exception as e:
        print(f"[FAIL] {ep} => {e}")

print("\nDone.")
