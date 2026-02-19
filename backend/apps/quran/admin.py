from django.contrib import admin
from .models import Surah, Juz, Ayah

@admin.register(Surah)
class SurahAdmin(admin.ModelAdmin):
    list_display = ('number', 'name_english', 'name_arabic', 'total_ayahs')
    search_fields = ('name_english', 'name_arabic')

@admin.register(Juz)
class JuzAdmin(admin.ModelAdmin):
    list_display = ('number',)

@admin.register(Ayah)
class AyahAdmin(admin.ModelAdmin):
    list_display = ('surah', 'ayah_number_in_surah', 'juz', 'ayah_number_global')
    list_filter = ('surah', 'juz')
    search_fields = ('text_arabic', 'text_translation_en')
