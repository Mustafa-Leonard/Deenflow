import os
import django
import sys
import logging

# Set up logging to stdout
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Set up Django environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    django.setup()
    from django.contrib.auth import get_user_model
    from django.core.management import call_command
    from django.db import connection
except Exception as e:
    logger.error(f"Critical error during Django setup: {e}")
    sys.exit(1)

def run_setup():
    logger.info("Starting DeenFlow Auto-Setup Script...")
    
    # 1. Check Database Connection
    try:
        logger.info("Checking database connection...")
        connection.ensure_connection()
        db_engine = connection.vendor
        logger.info(f"Connected to database engine: {db_engine}")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        # We don't exit here, maybe migrate will show more info
        
    # 2. Run migrations
    try:
        logger.info("Running migrations (this may take a moment)...")
        call_command('migrate', interactive=False)
        logger.info("Migrations completed successfully.")
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        # We continue to try to create a user anyway

    # 3. Create Superuser
    try:
        User = get_user_model()
        email = os.environ.get('ADMIN_EMAIL', 'leonardlewa372@gmail.com')
        password = os.environ.get('ADMIN_PASSWORD', 'leonard%372')
        
        # Check if user exists by email
        user = User.objects.filter(email=email).first()
        if not user:
            logger.info(f"Creating superuser: {email}")
            User.objects.create_superuser(username=email, email=email, password=password)
            logger.info("Superuser created successfully.")
        else:
            logger.info(f"Superuser {email} already exists. Updating password...")
            user.set_password(password)
            user.save()
            logger.info("Superuser password updated.")
            
    except Exception as e:
        logger.error(f"Error during superuser creation/update: {e}")

if __name__ == "__main__":
    run_setup()
