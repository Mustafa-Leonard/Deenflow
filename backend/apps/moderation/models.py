from django.db import models
from django.conf import settings
from answers.models import DraftAnswer

class AnswerReview(models.Model):
    draft_answer = models.OneToOneField(DraftAnswer, on_delete=models.CASCADE, related_name='review')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    decision = models.CharField(max_length=20, choices=[('approve', 'Approve'), ('reject', 'Reject')])
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ReviewChecklist(models.Model):
    review = models.OneToOneField(AnswerReview, on_delete=models.CASCADE, related_name='checklist')
    ruling_verified = models.BooleanField(default=False)
    no_personal_opinion = models.BooleanField(default=False)
    riba_addressed = models.BooleanField(default=False)
    darurah_not_misused = models.BooleanField(default=False)
    scholarly_source_exists = models.BooleanField(default=False)
    respectful_tone = models.BooleanField(default=False)
