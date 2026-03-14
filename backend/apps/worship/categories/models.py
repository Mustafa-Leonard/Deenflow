import uuid
from django.db import models

class WorshipCategory(models.Model):
    TYPE_CHOICES = (
        ('dhikr', 'Dhikr'),
        ('dua', 'Dua'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'worship_categories'
        verbose_name = 'Worship Category'
        verbose_name_plural = 'Worship Categories'

    def __str__(self):
        return f"{self.name} ({self.type})"
