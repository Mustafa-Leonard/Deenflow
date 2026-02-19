from django.db import models
from django.conf import settings

class Role(models.Model):
    NAME_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('content_admin', 'Content Admin'),
        ('fiqh_reviewer', 'Fiqh Reviewer'),
        ('moderator', 'Moderator'),
        ('member', 'Member'),
    ]
    name = models.CharField(max_length=50, choices=NAME_CHOICES, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.get_name_display()

class UserRole(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'role')
