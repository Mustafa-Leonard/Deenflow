import uuid
from django.db import models
from django.conf import settings
from worship.categories.models import WorshipCategory

class WorshipReminder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='worship_reminders_v2')
    category = models.ForeignKey(WorshipCategory, on_delete=models.CASCADE, null=True, blank=True)
    scheduled_time = models.TimeField()
    repeat_rule = models.CharField(max_length=50, default='daily')
    title = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'reminders_v2' # Rename to avoid conflict with existing if needed
        verbose_name = 'Worship Reminder'
        verbose_name_plural = 'Worship Reminders'

    def __str__(self):
        return f"{self.title or 'Reminder'} for {self.user.username}"
