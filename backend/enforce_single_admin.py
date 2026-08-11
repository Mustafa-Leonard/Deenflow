"""
Enforce the SINGLE SUPER ADMIN policy permanently.
- Sets the primary admin (admin@deenflow.com) credentials.
- Permanently deletes any extra superuser / admin accounts (e.g. hafsaali).
- Demotes any other superusers to regular members.
"""
import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django.setup()

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q

User = get_user_model()


def main():
    # The ONE and ONLY super admin
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@deenflow.com')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'Admin@12345')

    print("=" * 50)
    print("ENFORCING SINGLE SUPER ADMIN POLICY")
    print("=" * 50)

    # 1. Ensure the primary admin exists with known credentials
    admin, created = User.objects.get_or_create(
        email=admin_email,
        defaults={'username': admin_email, 'full_name': 'DeenFlow Admin'},
    )
    admin.set_password(admin_password)
    admin.is_staff = True
    admin.is_superuser = True
    admin.role = 'super_admin'
    admin.save()
    print(f"[OK] Primary admin ready: {admin_email} (created={created})")

    # 2. Delete any admin-ish accounts that are NOT the primary admin
    #    (superusers, staff, or curated admin roles)
    admin_roles = ['super_admin', 'content_admin', 'fiqh_reviewer', 'moderator']
    candidates = User.objects.filter(
        Q(is_superuser=True) |
        Q(is_staff=True) |
        Q(role__in=admin_roles)
    ).exclude(pk=admin.pk)

    deleted, demoted = 0, 0
    for u in candidates:
        if u.role == 'member' and not u.is_staff and not u.is_superuser:
            continue
        # Permanently delete the extra admin account (e.g. hafsaali)
        print(f"[DELETE] Removing extra admin account: {u.username} ({u.email})")
        u.delete()
        deleted += 1

    # 3. Demote any remaining superusers (safety net)
    for u in User.objects.filter(is_superuser=True).exclude(pk=admin.pk):
        print(f"[DEMOTE] {u.username} -> member")
        u.is_superuser = False
        u.is_staff = False
        u.role = 'member'
        u.save()
        demoted += 1

    print("-" * 50)
    print(f"Primary admin: {admin_email}")
    print(f"Extra admins deleted: {deleted}")
    print(f"Extra superusers demoted: {demoted}")
    print("=" * 50)


if __name__ == '__main__':
    with transaction.atomic():
        main()
