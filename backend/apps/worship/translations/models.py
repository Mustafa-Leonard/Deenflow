import uuid
from django.db import models

class Translation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    language_code = models.CharField(max_length=10, db_index=True)
    surah_number = models.PositiveIntegerField()
    ayah_number = models.PositiveIntegerField()
    text = models.TextField()
    source_name = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'translations'
        unique_together = ('language_code', 'surah_number', 'ayah_number')
        indexes = [
            models.Index(fields=['surah_number', 'ayah_number', 'language_code']),
        ]
        verbose_name = 'Translation'
        verbose_name_plural = 'Translations'

    def __str__(self):
        return f"{self.language_code} - Surah {self.surah_number}, Ayah {self.ayah_number}"
