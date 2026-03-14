import uuid
from django.db import models
from worship.categories.models import WorshipCategory

class DuaItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(WorshipCategory, on_delete=models.CASCADE, related_name='dua_items')
    title = models.CharField(max_length=255)
    arabic_text = models.TextField(blank=True, help_text="Store only if not quranic")
    translation = models.TextField(blank=True, help_text="Store only if not quranic")
    reference = models.CharField(max_length=255, blank=True, help_text="Hadith or other source")
    is_quranic = models.BooleanField(default=False)
    verse_reference = models.CharField(max_length=50, blank=True, help_text="Format: Surah:Ayah, e.g., 2:255")

    class Meta:
        db_table = 'dua_items'
        verbose_name = 'Dua Item'
        verbose_name_plural = 'Dua Items'

    def __str__(self):
        return f"{self.title} ({self.category.name})"
