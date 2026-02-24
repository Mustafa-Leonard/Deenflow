import os
import django

# Set settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = 'hafsaali'
password = 'hafsa12345'
email = 'hafsa@example.com'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f'Successfully created superuser: {username}')
else:
    print(f'User {username} already exists')
