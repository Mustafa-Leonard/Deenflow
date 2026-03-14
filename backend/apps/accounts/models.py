from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = [
        ('super_admin', 'Super Admin'),
        ('content_admin', 'Content Admin'),
        ('fiqh_reviewer', 'Fiqh Reviewer'),
        ('moderator', 'Moderator'),
        ('member', 'Member'),
    ]

    full_name = models.CharField(max_length=200, blank=True)
    theme = models.CharField(max_length=10, default='light', choices=[('light', 'Light'), ('dark', 'Dark')])
    role = models.CharField(max_length=20, choices=ROLES, default='member')
    madhhab = models.CharField(max_length=20, default='hanafi', choices=[
        ('hanafi', 'Hanafi'),
        ('shafii', 'Shafi\'i'),
        ('maliki', 'Maliki'),
        ('hanbali', 'Hanbali'),
    ])

    @property
    def is_admin(self):
        return self.is_superuser or self.is_staff or self.role in ['super_admin', 'content_admin', 'fiqh_reviewer', 'moderator']

    @property
    def is_fiqh_authorized(self):
        return self.role in ['super_admin', 'fiqh_reviewer'] or self.is_superuser

    def __str__(self):
        return self.username or self.email
