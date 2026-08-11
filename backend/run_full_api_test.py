"""
DeenFlow Full API Assessment Test
Tests health, registration, user login, admin login, and key admin/member endpoints.
"""
import requests
import json
import sys

BASE = 'http://localhost:8000/api'
RESULTS = []

def record(name, ok, detail=''):
    RESULTS.append((name, ok, detail))
    status = 'PASS' if ok else 'FAIL'
    print(f"[{status}] {name}" + (f" - {detail}" if detail and not ok else ""))

def get(url, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    try:
        r = requests.get(url, headers=headers, timeout=15)
        return r
    except Exception as e:
        return None

def post(url, data, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    try:
        r = requests.post(url, json=data, headers=headers, timeout=15)
        return r
    except Exception as e:
        return None

def patch(url, data, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    try:
        r = requests.patch(url, json=data, headers=headers, timeout=15)
        return r
    except Exception as e:
        return None

# 1. Health
r = get(BASE + '/health/')
record('Health endpoint', r is not None and r.status_code == 200, f"{r.status_code if r else 'no resp'}")

# 2. Registration
import time
reg_email = f"assess_{int(time.time())}@test.com"
r = post(BASE + '/auth/register/', {'email': reg_email, 'password': 'Test@12345', 'full_name': 'Assessment User'})
reg = r.status_code == 201 if r else False
record('User registration', reg, f"{r.status_code if r else 'no resp'} - {r.text[:120] if r else ''}")
user_token = r.json().get('access') if reg else None

# Short pause to allow SQLite to release write lock
time.sleep(1)

# 3. User login
r = post(BASE + '/auth/token/', {'username': reg_email, 'password': 'Test@12345'})
login_ok = r is not None and r.status_code == 200
record('User login', login_ok, f"{r.status_code if r else 'no resp'}")
if login_ok and not user_token:
    user_token = r.json().get('access')

# 4. Profile (authenticated user)
r = get(BASE + '/auth/profile/', user_token)
record('User profile (auth)', r is not None and r.status_code == 200, f"{r.status_code if r else 'no resp'}")

# 5. Member endpoints
r = get(BASE + '/auth/member/dashboard-overview/', user_token)
record('Member dashboard (auth)', r is not None and r.status_code == 200, f"{r.status_code if r else 'no resp'}")
r = get(BASE + '/auth/member/stats/', user_token)
record('Member stats (auth)', r is not None and r.status_code == 200, f"{r.status_code if r else 'no resp'}")
r = get(BASE + '/auth/member/daily-ayah/', user_token)
record('Daily ayah (auth)', r is not None and r.status_code == 200, f"{r.status_code if r else 'no resp'}")

# 6. Unauthorized access to admin endpoint (should be 403)
r = get(BASE + '/auth/admin/dashboard/stats/', user_token)
record('Admin endpoint unauth user blocked (403)', r is not None and r.status_code == 403, f"{r.status_code if r else 'no resp'}")

# 7. Admin login
r = post(BASE + '/auth/token/', {'username': 'admin@deenflow.com', 'password': 'Admin@12345'})
admin_login_ok = r is not None and r.status_code == 200
record('Admin login', admin_login_ok, f"{r.status_code if r else 'no resp'}")
admin_token = r.json().get('access') if admin_login_ok else None
if admin_login_ok:
    rec_admin_user = r.json().get('user', {})
    record('Admin login returns is_admin user', rec_admin_user.get('is_admin') is True, json.dumps(rec_admin_user))

# 8. Admin endpoints
if admin_token:
    admin_endpoints = [
        '/auth/admin/dashboard/stats/',
        '/auth/admin/dashboard/recent-activity/',
        '/auth/admin/dashboard/pending-reviews/',
        '/auth/admin/dashboard/top-topics/',
        '/auth/admin/dashboard/health/',
        '/auth/admin/dashboard/overview/',
        '/auth/admin/users/',
        '/auth/admin/ai/logs/',
        '/auth/admin/ai/flagged/',
        '/auth/admin/ai-config/',
        '/auth/admin/scholars/',
        '/auth/admin/roles/',
        '/auth/admin/permissions/',
        '/auth/admin/moderation/reports/',
        '/auth/admin/categories/',
        '/auth/admin/tags/',
        '/auth/admin/content/',
        '/auth/admin/analytics/questions-per-day/',
        '/auth/admin/analytics/ai-flag-rate/',
        '/auth/admin/analytics/active-users/',
        '/auth/admin/audit-logs/',
    ]
    for ep in admin_endpoints:
        r = get(BASE + ep, admin_token)
        name = ep.replace('/auth/admin/', 'admin ').replace('/', ' ').strip()
        record(f'Admin {name}', r is not None and r.status_code == 200, f"{r.status_code if r else 'no resp'}")

# 9. CORS check - OPTIONS preflight from frontend origin
try:
    r = requests.options(BASE + '/auth/token/', headers={
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }, timeout=15)
    cors_ok = r.status_code == 200 and 'access-control-allow-origin' in r.headers
    record(f'CORS preflight from 5173', cors_ok, f"{r.status_code} ACAO={r.headers.get('access-control-allow-origin')}")
except Exception as e:
    record('CORS preflight', False, str(e))

# 10. Real data verification - users list should show DB users
if admin_token:
    r = get(BASE + '/auth/admin/users/', admin_token)
    if r is not None and r.status_code == 200:
        try:
            users = r.json()
            record('Admin users list returns real DB data', isinstance(users, list) and len(users) > 0, f"{len(users)} users")
            emails = [u.get('email') for u in users]
            record('DB users present in list', 'admin@deenflow.com' in emails, f"found: {emails[:5]}")
        except Exception as e:
            record('Admin users list parse', False, str(e))

print("\n" + "="*60)
passed = sum(1 for r in RESULTS if r[1])
failed = sum(1 for r in RESULTS if not r[1])
print(f"SUMMARY: {passed} passed, {failed} failed, {len(RESULTS)} total")
for name, ok, detail in RESULTS:
    if not ok:
        print(f"  FAILED: {name} - {detail}")
print("="*60)
sys.exit(0 if failed == 0 else 1)

