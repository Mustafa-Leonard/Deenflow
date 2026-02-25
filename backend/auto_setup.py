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
    
    # 1. Check Database Environment
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        logger.error("CRITICAL: DATABASE_URL environment variable is MISSING or EMPTY!")
        logger.info("Please go to Render Dashboard -> Environment and add DATABASE_URL.")
    else:
        logger.info(f"DATABASE_URL is present (Type: {db_url.split(':')[0]})")

    # 2. Check Database Connection
    try:
        logger.info("Checking database connection...")
        connection.ensure_connection()
        db_engine = connection.vendor
        logger.info(f"Connected to database engine: {db_engine}")
        
        if db_engine == 'sqlite':
            logger.warning("WARNING: You are connected to SQLITE instead of POSTGRESQL!")
            logger.warning("This means your data will be WIPED every time the server restarts.")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        if "Network is unreachable" in str(e) or "2a05" in str(e):
            logger.error("-" * 60)
            logger.error("SUPABASE CONNECTION ERROR DETECTED (IPv6 Issue)")
            logger.error("Render's network often fails to connect to Supabase's direct URL.")
            logger.error("FIX: Go to Supabase Project Settings -> Database.")
            logger.error("Change your Connection String to 'Transaction Pooler' (Port 6543).")
            logger.error("Update Render DATABASE_URL with that new string.")
            logger.error("-" * 60)
        
    # 3. Run migrations
    try:
        logger.info("Running migrations...")
        call_command('migrate', interactive=False)
        logger.info("Migrations completed successfully.")
    except Exception as e:
        logger.error(f"Migration failed: {e}")

    # 4. Create/Update Superuser
    try:
        User = get_user_model()
        email = os.environ.get('ADMIN_EMAIL', 'leonardlewa372@gmail.com')
        password = os.environ.get('ADMIN_PASSWORD', 'leonard%372')
        
        # Check if user exists by email
        user = User.objects.filter(email=email).first()
        if not user:
            logger.info(f"Creating superuser: {email}")
            User.objects.create_superuser(username=email, email=email, password=password)
            logger.info(f"Superuser {email} created successfully.")
        else:
            logger.info(f"Superuser {email} already exists. Updating password to ensure it matches...")
            user.set_password(password)
            user.save()
            logger.info("Superuser password updated successfully.")
            
    except Exception as e:
        logger.error(f"Error during superuser creation/update: {e}")

if __name__ == "__main__":
    run_setup()
