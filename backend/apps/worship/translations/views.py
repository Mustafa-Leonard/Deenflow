from rest_framework import status, views, response
from .services import TranslationService

class TranslationView(views.APIView):
    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        surah = request.query_params.get('surah')
        ayah = request.query_params.get('ayah')
        
        if not surah or not ayah:
            return response.Response({"error": "surah and ayah are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        text = TranslationService.get_translation(lang, int(surah), int(ayah))
        if text:
            return response.Response({"text": text, "lang": lang})
            
        return response.Response({"error": "Translation not found"}, status=status.HTTP_404_NOT_FOUND)

class LanguageListView(views.APIView):
    def get(self, request):
        languages = TranslationService.list_languages()
        return response.Response({"languages": list(languages)})
