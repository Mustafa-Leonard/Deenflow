import os
import django
import sys
import logging

# Set up logging to stdout
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# Set up Django environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

def run_setup():
    logger.info("="*40)
    logger.info("DEENFLOW AUTO-SETUP STARTING")
    logger.info("="*40)
    
    # 1. Check Environment Variables
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        logger.error("ERROR: DATABASE_URL is MISSING! The app will fail to reach the database.")
        logger.info("Please add DATABASE_URL to your Render Environment Variables.")
    else:
        # Mask password for safety in logs
        safe_url = db_url.split('@')[-1] if '@' in db_url else "Hidden"
        logger.info(f"DATABASE_URL detected. Target: {safe_url}")

    # 2. Django Setup
    try:
        django.setup()
        from django.db import connection
        from django.contrib.auth import get_user_model
        from django.core.management import call_command
    except Exception as e:
        logger.error(f"DJANGO SETUP CRITICAL FAILURE: {e}")
        return

    # 3. Test Connection
    try:
        logger.info("Testing connection to Postgres...")
        connection.ensure_connection()
        logger.info(f"SUCCESS: Connected to {connection.vendor} database.")
        
        if connection.vendor == 'sqlite':
            logger.warning("CRITICAL WARNING: App is using SQLite instead of Postgres!")
            logger.warning("This means DATABASE_URL is either invalid or being ignored.")
    except Exception as e:
        logger.error(f"DATABASE CONNECTION FAILED: {e}")
        logger.info("Check if your Supabase password has special characters like '%' and encode them as '%25'.")
        logger.info("Also ensure you use the POOLER URL (Port 6543) instead of direct (Port 5432).")
        return # Abort if we can't connect, no point in migrating

    # 4. Run migrations
    try:
        logger.info("Running migrations...")
        call_command('migrate', interactive=False)
        logger.info("Migrations finished successfully.")
    except Exception as e:
        logger.error(f"MIGRATION FAILED: {e}")

    # 5. Create/Update Admin
    try:
        User = get_user_model()
        email = os.environ.get('ADMIN_EMAIL', 'leonardlewa372@gmail.com')
        password = os.environ.get('ADMIN_PASSWORD', 'leonard%372')
        
        user, created = User.objects.get_or_create(email=email, defaults={'username': email})
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.role = 'super_admin'
        user.save()
        
        if created:
            logger.info(f"Admin account CREATED: {email}")
        else:
            logger.info(f"Admin account UPDATED (Password Reset): {email}")
            
    except Exception as e:
        logger.error(f"ADMIN SETUP FAILED: {e}")

    logger.info("="*40)
    logger.info("AUTO-SETUP COMPLETE")
    logger.info("="*40)

if __name__ == "__main__":
    run_setup()
