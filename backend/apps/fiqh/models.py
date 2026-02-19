from django.db import models
from django.conf import settings

class FiqhRuling(models.Model):
    VERIFICATION_STATUS = [
        ('draft', 'Draft'),
        ('verified', 'Verified'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=255)
    topic = models.CharField(max_length=100)
    ruling_text = models.TextField()
    
    # Evidence stored as structured JSON
    evidence_quran = models.JSONField(default=list, blank=True)
    evidence_hadith = models.JSONField(default=list, blank=True)
    
    scholar = models.CharField(max_length=255, blank=True)
    scholar_reference = models.TextField(blank=True)
    fiqh_school = models.CharField(max_length=100, blank=True)
    
    tags = models.JSONField(default=list, blank=True)
    source_url = models.URLField(blank=True)
    
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='draft')
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Fiqh Ruling"
        verbose_name_plural = "Fiqh Rulings"
        indexes = [
            models.Index(fields=['topic']),
            models.Index(fields=['verification_status']),
        ]

    def __str__(self):
        return f"{self.topic}: {self.title}"
