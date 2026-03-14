import uuid
from django.db import models

class Reciter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    audio_base_url = models.URLField(max_length=500)
    style = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'reciters'
        verbose_name = 'Reciter'
        verbose_name_plural = 'Reciters'

    def __str__(self):
        return self.name

class AudioTrack(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    surah_number = models.PositiveIntegerField()
    ayah_number = models.PositiveIntegerField()
    reciter = models.ForeignKey(Reciter, on_delete=models.CASCADE, related_name='tracks', db_index=True)
    audio_url = models.URLField(max_length=500)
    duration = models.IntegerField(help_text="Duration in seconds", null=True, blank=True)

    class Meta:
        db_table = 'audio_tracks'
        unique_together = ('surah_number', 'ayah_number', 'reciter')
        verbose_name = 'Audio Track'
        verbose_name_plural = 'Audio Tracks'

    def __str__(self):
        return f"Surah {self.surah_number}, Ayah {self.ayah_number} - {self.reciter.name}"
