from rest_framework import status, views, response
from .services import QuranAudioService

class QuranAudioView(views.APIView):
    def get(self, request):
        surah = request.query_params.get('surah')
        ayah = request.query_params.get('ayah')
        reciter_id = request.query_params.get('reciter')
        
        if not surah or not ayah or not reciter_id:
            return response.Response({"error": "surah, ayah, and reciter are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        url = QuranAudioService.get_audio_url(int(surah), int(ayah), reciter_id)
        if url:
            return response.Response({"audio_url": url})
            
        return response.Response({"error": "Failed to generate audio URL"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReciterListView(views.APIView):
    def get(self, request):
        reciters = QuranAudioService.list_reciters()
        data = [{"id": r.id, "name": r.name, "audio_base_url": r.audio_base_url, "style": r.style} for r in reciters]
        return response.Response(data)
