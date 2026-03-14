import uuid
from django.db import models
from django.conf import settings
from worship.categories.models import WorshipCategory

class DhikrItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(WorshipCategory, on_delete=models.CASCADE, related_name='dhikr_items')
    arabic_text = models.TextField()
    transliteration = models.TextField(blank=True)
    translation = models.TextField(blank=True)
    repeat_default = models.PositiveIntegerField(default=1)
    source_reference = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'dhikr_items'
        verbose_name = 'Dhikr Item'
        verbose_name_plural = 'Dhikr Items'

    def __str__(self):
        return f"{self.translation[:50]} ({self.category.name})"

class UserDhikrLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='dhikr_logs')
    dhikr = models.ForeignKey(DhikrItem, on_delete=models.CASCADE, related_name='logs')
    count = models.PositiveIntegerField(default=0)
    last_performed = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_dhikr_logs'
        unique_together = ('user', 'dhikr')
        verbose_name = 'User Dhikr Log'
        verbose_name_plural = 'User Dhikr Logs'
