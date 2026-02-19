from django.db import models

class DailyStats(models.Model):
    date = models.DateField(unique=True)
    total_users = models.IntegerField(default=0)
    questions_count = models.IntegerField(default=0)
    answers_count = models.IntegerField(default=0)
    flags_count = models.IntegerField(default=0)
    
    class Meta:
        verbose_name_plural = "Daily Stats"
