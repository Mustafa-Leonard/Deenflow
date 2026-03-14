import uuid
from django.db import models

class AsmaulHusna(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_arabic = models.CharField(max_length=255)
    transliteration = models.CharField(max_length=255)
    meaning = models.CharField(max_length=255)
    explanation = models.TextField(blank=True)

    class Meta:
        db_table = 'asmaul_husna'
        verbose_name = 'Name of Allah'
        verbose_name_plural = 'Names of Allah'

    def __str__(self):
        return f"{self.transliteration} ({self.name_arabic})"
