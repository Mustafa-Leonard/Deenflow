import requests
import time

API = 'http://127.0.0.1:8000/api'

# Register a new test member
reg = requests.post(API + '/auth/register/', json={
    'username': 'e2e_member',
    'email': 'e2e_member@example.com',
    'password': 'memberpass'
})
print('register status', reg.status_code, reg.text)

# Obtain JWT token
tok = requests.post(API + '/auth/token/', json={'username': 'e2e_member', 'password': 'memberpass'})
print('token status', tok.status_code, tok.text)
if tok.status_code != 200:
    # maybe user already exists, try token anyway
    tok = requests.post(API + '/auth/token/', json={'username': 'e2e_member', 'password': 'memberpass'})

access = None
if tok.status_code == 200:
    access = tok.json().get('access')
else:
    print('Failed to obtain token, aborting')

if access:
    headers = {'Authorization': 'Bearer ' + access, 'Content-Type': 'application/json'}
    resp = requests.post(API + '/questions/', json={'text': 'E2E test question from member'}, headers=headers)
    print('POST question status', resp.status_code, resp.text)

    # As admin, list questions
    admin_tok = requests.post(API + '/auth/token/', json={'username': 'devadmin', 'password': 'adminpass'})
    if admin_tok.status_code == 200:
        admin_access = admin_tok.json().get('access')
        admin_h = {'Authorization': 'Bearer ' + admin_access}
        list_resp = requests.get(API + '/questions/', headers=admin_h)
        print('Admin GET questions status', list_resp.status_code, 'count', len(list_resp.json()))
    else:
        print('Failed to login admin')
else:
    print('No access token, stopping')
