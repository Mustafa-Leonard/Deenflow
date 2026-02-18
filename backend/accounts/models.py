from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    full_name = models.CharField(max_length=200, blank=True)
    theme = models.CharField(max_length=10, default='light', choices=[('light', 'Light'), ('dark', 'Dark')])

    @property
    def is_admin(self):
        return self.is_staff or self.is_superuser

    def __str__(self):
        return self.username or self.email
