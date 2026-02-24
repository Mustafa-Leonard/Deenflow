import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()
user, created = User.objects.get_or_create(username='testmember', defaults={'email':'testmember@example.com'})
user.set_password('testpass')
user.save()
print('USER_ID', user.id)
token, _ = Token.objects.get_or_create(user=user)
print('TOKEN', token.key)
