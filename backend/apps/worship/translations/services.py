from .models import Translation

class TranslationService:
    @staticmethod
    def get_translation(lang, surah, ayah):
        """
        Fetch translation by language code and position.
        """
        try:
            translation = Translation.objects.filter(
                language_code=lang, 
                surah_number=surah, 
                ayah_number=ayah
            ).first()
            if translation:
                return translation.text
            return None
        except Exception:
            return None

    @staticmethod
    def list_languages():
        """
        List all available translation languages.
        """
        return Translation.objects.values_list('language_code', flat=True).distinct()
