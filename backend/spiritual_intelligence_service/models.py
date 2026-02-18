from django.db import models
from django.conf import settings

# --- FIQH RULE ENGINE ---

class Madhhab(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Evidence(models.Model):
    SOURCE_CHOICES = [
        ('quran', 'Qur\'an'),
        ('hadith', 'Hadith'),
        ('ijma', 'Ijma (Consensus)'),
        ('qiyas', 'Qiyas (Analogy)'),
    ]
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    reference = models.CharField(max_length=255) # e.g., "Surah Al-Baqarah 2:183"
    text_arabic = models.TextField(blank=True)
    text_english = models.TextField()
    source_book = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"[{self.get_source_type_display()}] {self.reference}"

class Ruling(models.Model):
    CATEGORY_CHOICES = [
        ('salah', 'Salah'),
        ('sawm', 'Fasting'),
        ('zakat', 'Zakat'),
        ('hajj', 'Hajj'),
        ('nikah', 'Marriage'),
        ('muamalat', 'Financial'),
    ]
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    madhhab = models.ForeignKey(Madhhab, on_delete=models.CASCADE, related_name='rulings')
    summary = models.TextField()
    verdict = models.CharField(max_length=100) # e.g., "Fard", "Mustahabb", "Haram"
    evidence = models.ManyToManyField(Evidence, related_name='rulings')
    
    # AI usage: explain_only flag enforces that AI cannot change the verdict
    ai_explanation_prompt = models.TextField(help_text="Instructions for AI to explain this ruling")

    def __str__(self):
        return f"{self.title} ({self.madhhab.name})"

class Condition(models.Model):
    ruling = models.ForeignKey(Ruling, on_delete=models.CASCADE, related_name='conditions')
    text = models.CharField(max_length=255)
    is_required = models.BooleanField(default=True)

class ExceptionRule(models.Model):
    ruling = models.ForeignKey(Ruling, on_delete=models.CASCADE, related_name='exceptions')
    scenario = models.CharField(max_length=255) # e.g., "Traveler", "Sick person"
    modification = models.TextField() # e.g., "Shorten prayers"

# --- PERSONAL DEEN PLANNER ---

class UserDeenPlan(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deen_plan')
    start_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    # JSON field for flexible goal storage: {salah: [...], fasting: [...]}
    goals_data = models.JSONField(default=dict)
    
    weekly_review_notes = models.TextField(blank=True)
    auto_summary = models.TextField(blank=True)

    def __str__(self):
        return f"Plan for {self.user.email}"

class GoalTarget(models.Model):
    plan = models.ForeignKey(UserDeenPlan, on_delete=models.CASCADE, related_name='targets')
    category = models.CharField(max_length=50) # e.g., "Quran", "Salah"
    title = models.CharField(max_length=255)
    target_value = models.IntegerField() # e.g., 5 (prayers) or 10 (pages)
    unit = models.CharField(max_length=50)
    frequency = models.CharField(max_length=20, choices=[('daily', 'Daily'), ('weekly', 'Weekly')])

class WorshipLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.CharField(max_length=50) # e.g., "salah_dhuhur", "quran_reading"
    value = models.FloatField(default=1.0)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict) # e.g., {location: "Mosque"}

    class Meta:
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['category']),
        ]
