import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.core.management import call_command

def run_setup():
    print("Starting auto-setup...")
    
    # 1. Run migrations
    try:
        print("Running migrations...")
        call_command('migrate', interactive=False)
        print("Migrations successful.")
    except Exception as e:
        print(f"Migration error: {e}")

    # 2. Create Superuser
    User = get_user_model()
    # You can change these or set them in Render Env Vars
    email = os.environ.get('ADMIN_EMAIL', 'leonardlewa372@gmail.com')
    password = os.environ.get('ADMIN_PASSWORD', 'leonard%372')
    
    if not User.objects.filter(email=email).exists():
        print(f"Creating superuser for {email}...")
        User.objects.create_superuser(username=email, email=email, password=password)
        print("Superuser created successfully.")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    run_setup()
