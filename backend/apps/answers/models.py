from django.db import models
from questions.models import Question
from fiqh.models import FiqhRuling
from django.conf import settings

class DraftAnswer(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='drafts')
    ai_text = models.TextField()
    used_rulings = models.ManyToManyField(FiqhRuling, related_name='used_in_drafts')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Draft for Q({self.question_id})"

class Answer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='final_answer')
    text = models.TextField()
    published_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='published_answers')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer for Q({self.question_id})"

class AnswerSource(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='sources')
    fiqh_ruling = models.ForeignKey(FiqhRuling, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('answer', 'fiqh_ruling')

class SavedAnswer(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_answers')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'answer')
