from rest_framework import serializers
from .models import Surah, Juz, Ayah, UserBookmark, UserReadingProgress, UserReflection

class AyahSerializer(serializers.ModelSerializer):
    translations = serializers.SerializerMethodField()
    ayah_number = serializers.IntegerField(source='ayah_number_in_surah')
    surah_number = serializers.IntegerField(source='surah.number', read_only=True)
    
    class Meta:
        model = Ayah
        fields = [
            'id', 'ayah_number', 'ayah_number_in_surah', 'ayah_number_global', 
            'surah_number', 'text_arabic', 'text_translation_en', 'audio_url', 'translations'
        ]
        
    def get_translations(self, obj):
        return [{
            "id": 1,
            "source_name": "Sahih International",
            "text": obj.text_translation_en
        }]

class SurahSerializer(serializers.ModelSerializer):
    # Field aliases for backward compatibility with frontend
    ayah_count = serializers.IntegerField(source='total_ayahs')
    revelation_type = serializers.CharField(source='revelation_place')
    
    class Meta:
        model = Surah
        fields = ['id', 'number', 'name_arabic', 'name_english', 'revelation_place', 'revelation_type', 'total_ayahs', 'ayah_count']

class SurahDetailSerializer(serializers.ModelSerializer):
    ayahs = AyahSerializer(many=True, read_only=True)
    ayah_count = serializers.IntegerField(source='total_ayahs')
    revelation_type = serializers.CharField(source='revelation_place')

    class Meta:
        model = Surah
        fields = ['id', 'number', 'name_arabic', 'name_english', 'revelation_type', 'ayah_count', 'ayahs']

class JuzSerializer(serializers.ModelSerializer):
    class Meta:
        model = Juz
        fields = ['id', 'number']

class JuzDetailSerializer(serializers.ModelSerializer):
    ayahs = AyahSerializer(many=True, read_only=True)
    class Meta:
        model = Juz
        fields = ['id', 'number', 'ayahs']

class UserBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBookmark
        fields = ['id', 'ayah', 'created_at']

class UserReadingProgressSerializer(serializers.ModelSerializer):
    surah_name = serializers.ReadOnlyField(source='surah.name_english')
    ayah_number = serializers.ReadOnlyField(source='ayah.ayah_number_in_surah')
    
    class Meta:
        model = UserReadingProgress
        fields = ['id', 'surah', 'surah_name', 'ayah', 'ayah_number', 'updated_at']

class UserReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReflection
        fields = ['id', 'ayah', 'text', 'is_private', 'created_at']
