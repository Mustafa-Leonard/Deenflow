from django.db import models
from django.conf import settings

class GuidanceRequest(models.Model):
    STATUS_CHOICES = [('pending','pending'),('done','done'),('failed','failed')]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    input_text = models.TextField()
    category = models.CharField(max_length=200, blank=True)
    response_json = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    flagged = models.BooleanField(default=False)
    reviewed = models.BooleanField(default=False)
    flag_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Guidance({self.id}) {self.user}"

class SavedReflection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    guidance = models.ForeignKey(GuidanceRequest, on_delete=models.CASCADE, related_name='reflections')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reflection({self.id}) by {self.user}"
