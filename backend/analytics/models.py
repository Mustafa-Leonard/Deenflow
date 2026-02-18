from django.db import models
from django.conf import settings

class DailyInsight(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    worship_score = models.IntegerField() # calculated 0-100
    focus_area = models.CharField(max_length=100) # e.g., "Consistent Salah"
    generated_text = models.TextField() # "You've been consistent with Fajr this week!"
    
    class Meta:
        unique_together = ('user', 'date')

class TrendAnalysis(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    metric = models.CharField(max_length=50) # e.g., "salah_consistency"
    period_start = models.DateField()
    period_end = models.DateField()
    value = models.FloatField()
    trend_direction = models.CharField(max_length=10, choices=[('up', 'Improving'), ('down', 'Declining'), ('stable', 'Stable')])

class RiskAlert(models.Model):
    # Detection of decline in worship
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=50) # e.g., "habit_break_detected"
    description = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
