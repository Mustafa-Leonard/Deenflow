import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client

User = get_user_model()
# Create member
member, _ = User.objects.get_or_create(username='api_member', defaults={'email':'api_member@example.com'})
member.set_password('memberpass')
member.save()
# Create admin
admin, _ = User.objects.get_or_create(username='api_admin', defaults={'email':'api_admin@example.com', 'is_staff': True})
admin.set_password('adminpass')
admin.is_staff = True
admin.save()

client = Client()
if not client.login(username='api_member', password='memberpass'):
    print('Member login failed')
else:
    resp = client.post('/api/questions/', data=json.dumps({'text': 'Test question from member via test client'}), content_type='application/json')
    print('Member POST status:', resp.status_code)
    print('Member POST content:', resp.content)

admin_client = Client()
if not admin_client.login(username='api_admin', password='adminpass'):
    print('Admin login failed')
else:
    resp = admin_client.get('/api/questions/')
    print('Admin GET status:', resp.status_code)
    print('Admin GET content length:', len(resp.content))
