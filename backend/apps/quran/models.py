from django.db import models
from django.conf import settings

class Surah(models.Model):
    number = models.IntegerField(unique=True)
    name_arabic = models.CharField(max_length=255)
    name_english = models.CharField(max_length=255)
    revelation_place = models.CharField(max_length=50) 
    total_ayahs = models.IntegerField()

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f"{self.number}. {self.name_english}"

class Juz(models.Model):
    number = models.IntegerField(unique=True)

    class Meta:
        ordering = ['number']
        verbose_name_plural = "Juzs"

    def __str__(self):
        return f"Juz {self.number}"

class Ayah(models.Model):
    surah = models.ForeignKey(Surah, on_delete=models.CASCADE, related_name='ayahs')
    juz = models.ForeignKey(Juz, on_delete=models.CASCADE, related_name='ayahs')
    ayah_number_in_surah = models.IntegerField()
    ayah_number_global = models.IntegerField(unique=True)
    text_arabic = models.TextField()
    text_translation_en = models.TextField()
    audio_url = models.URLField(max_length=500)

    class Meta:
        ordering = ['ayah_number_global']
        unique_together = ('surah', 'ayah_number_in_surah')

    def __str__(self):
        return f"{self.surah.number}:{self.ayah_number_in_surah}"

class UserBookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ayah = models.ForeignKey(Ayah, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'ayah')

class UserReadingProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    surah = models.ForeignKey(Surah, on_delete=models.CASCADE)
    ayah = models.ForeignKey(Ayah, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'surah')

class UserReflection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ayah = models.ForeignKey(Ayah, on_delete=models.CASCADE)
    text = models.TextField()
    is_private = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Reciter(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    thumbnail = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Recitation(models.Model):
    ayah = models.ForeignKey(Ayah, on_delete=models.CASCADE, related_name='recitations')
    reciter = models.ForeignKey(Reciter, on_delete=models.CASCADE, related_name='recitations')
    audio_url = models.URLField(max_length=500)

    class Meta:
        unique_together = ('ayah', 'reciter')

class TranslationSource(models.Model):
    name = models.CharField(max_length=255)
    language = models.CharField(max_length=50)
    provider = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.name} ({self.language})"

class AyahTranslation(models.Model):
    ayah = models.ForeignKey(Ayah, on_delete=models.CASCADE, related_name='translations')
    source = models.ForeignKey(TranslationSource, on_delete=models.CASCADE, related_name='translations')
    text = models.TextField()

    class Meta:
        unique_together = ('ayah', 'source')
