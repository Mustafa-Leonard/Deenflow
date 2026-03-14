import uuid
from django.db import models
from django.conf import settings

class UserFavorite(models.Model):
    TYPE_CHOICES = (
        ('dhikr', 'Dhikr'),
        ('dua', 'Dua'),
        ('asmaul_husna', 'Asmaul Husna'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='worship_favorites')
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    item_id = models.UUIDField() # ID of the DhikrItem, DuaItem, or AsmaulHusna

    class Meta:
        db_table = 'user_favorites'
        unique_together = ('user', 'item_type', 'item_id')
        verbose_name = 'User Favorite'
        verbose_name_plural = 'User Favorites'

    def __str__(self):
        return f"{self.user.username} favorite {self.item_type} {self.item_id}"
    
    @property
    def item(self):
        if self.item_type == 'dhikr':
            from worship.dhikr.models import DhikrItem
            return DhikrItem.objects.filter(id=self.item_id).first()
        elif self.item_type == 'dua':
            from worship.duas.models import DuaItem
            return DuaItem.objects.filter(id=self.item_id).first()
        elif self.item_type == 'asmaul_husna':
            from worship.asmaul_husna.models import AsmaulHusna
            return AsmaulHusna.objects.filter(id=self.item_id).first()
        return None
