import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from audit.services import AuditService
from audit.models import AuditLog
from django.contrib.auth import get_user_model

User = get_user_model()

# Clean up any test logs
AuditLog.objects.filter(entity_type='test').delete()

admin = User.objects.filter(is_superuser=True).first()
print(f"Test admin: {admin.username if admin else 'NONE'}")

# Call the service
AuditService.log_action(admin, 'test', 1, 'create', None, {'a': 1})

# Verify
count = AuditLog.objects.filter(entity_type='test').count()
print(f"AUDIT LOGS CREATED: {count}")
print("AuditService works correctly!" if count == 1 else "AuditService FAILED")

# Clean up
AuditLog.objects.filter(entity_type='test').delete()
