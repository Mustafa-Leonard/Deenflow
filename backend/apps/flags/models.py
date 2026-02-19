from django.db import models
from django.conf import settings
from answers.models import Answer

class Flag(models.Model):
    STATUS_CHOICES = [('active', 'Active'), ('resolved', 'Resolved')]
    
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='flags')
    reason = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
