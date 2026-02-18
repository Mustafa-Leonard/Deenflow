from django.contrib import admin
from .models import GuidanceRequest, SavedReflection

@admin.register(GuidanceRequest)
class GuidanceRequestAdmin(admin.ModelAdmin):
    list_display = ('id','user','category','status','created_at')

@admin.register(SavedReflection)
class SavedReflectionAdmin(admin.ModelAdmin):
    list_display = ('id','user','guidance','created_at')
