from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    entity_type = models.CharField(max_length=100)
    entity_id = models.IntegerField()
    action = models.CharField(max_length=50) # create, edit, delete, approve
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    previous_data = models.JSONField(null=True, blank=True)
    new_data = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
