from django.db import models
from django.conf import settings

class LearningPath(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    thumbnail = models.URLField(blank=True)
    difficulty = models.CharField(max_length=20, choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')])
    is_published = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        intro_keywords = ['introduction', 'basics', 'fundamentals', 'beginner', 'starting']
        title_lower = self.title.lower()
        if any(keyword in title_lower for keyword in intro_keywords):
            self.is_premium = False
            self.price = 0.00
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    path = models.ForeignKey(LearningPath, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField()
    content_markdown = models.TextField()
    video_url = models.URLField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=10)

    class Meta:
        ordering = ['order']

class Quiz(models.Model):
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name='quiz')
    title = models.CharField(max_length=255)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    options = models.JSONField() # e.g., ["A", "B", "C"]
    correct_option_index = models.PositiveIntegerField()

class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'lesson')

class Certificate(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    path = models.ForeignKey(LearningPath, on_delete=models.CASCADE)
    issued_at = models.DateTimeField(auto_now_add=True)
    certificate_id = models.CharField(max_length=50, unique=True)

class CourseEnrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    path = models.ForeignKey(LearningPath, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    access_type = models.CharField(max_length=20, choices=[('purchase', 'Purchase'), ('subscription', 'Subscription'), ('free', 'Free')])

    class Meta:
        unique_together = ('user', 'path')
