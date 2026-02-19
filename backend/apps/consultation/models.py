from django.db import models
from django.conf import settings

class Scholar(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scholar_profile')
    title = models.CharField(max_length=100) # e.g., Mufti, Sheikh, Dr.
    bio = models.TextField()
    profile_picture = models.URLField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    is_verified = models.BooleanField(default=False)
    verification_docs = models.JSONField(default=list) # List of doc URLs
    rating = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} {self.user.full_name}"

class Specialization(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class ScholarSpecialization(models.Model):
    scholar = models.ForeignKey(Scholar, on_delete=models.CASCADE, related_name='specializations')
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE)

class ConsultationSession(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]
    scholar = models.ForeignKey(Scholar, on_delete=models.CASCADE, related_name='sessions')
    member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='consultations')
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    topic = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    meeting_link = models.URLField(blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    commission_kept = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session: {self.scholar.user.full_name} with {self.member.email}"
