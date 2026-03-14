import uuid
from django.db import models
from django.conf import settings

class PrayerSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='worship_prayer_settings', db_index=True)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    location_lng = models.DecimalField(max_digits=9, decimal_places=6)
    calculation_method = models.CharField(max_length=100, default='ISNA')
    timezone = models.CharField(max_length=100, default='UTC')

    class Meta:
        db_table = 'prayer_settings'
        verbose_name = 'Prayer Settings'

    def __str__(self):
        return f"Settings for {self.user.username}"

class AdhanAlarm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='adhan_alarms', db_index=True)
    prayer_name = models.CharField(max_length=50) # Fajr, Dhuhr, etc.
    enabled = models.BooleanField(default=True)
    offset_minutes = models.SmallIntegerField(default=0)
    tone = models.CharField(max_length=100, default='default')

    class Meta:
        db_table = 'adhan_alarms'
        unique_together = ('user', 'prayer_name')
        verbose_name = 'Adhan Alarm'
        verbose_name_plural = 'Adhan Alarms'

    def __str__(self):
        return f"{self.prayer_name} alarm for {self.user.username}"

class UserPreferences(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='worship_preferences', db_index=True)
    selected_reciter = models.ForeignKey('audio.Reciter', on_delete=models.SET_NULL, null=True, blank=True, related_name='user_selections')
    translation_language = models.CharField(max_length=10, default='en')
    adhan_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_preferences'
        verbose_name = 'User Preferences'

    def __str__(self):
        return f"Worship Preferences for {self.user.username}"
