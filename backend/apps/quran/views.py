from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Surah, Juz, Ayah, UserBookmark, UserReadingProgress, UserReflection
from .serializers import (
    SurahSerializer, SurahDetailSerializer, AyahSerializer,
    JuzSerializer, JuzDetailSerializer,
    UserBookmarkSerializer, UserReadingProgressSerializer, UserReflectionSerializer
)

class SurahListView(generics.ListAPIView):
    queryset = Surah.objects.all().order_by('number')
    serializer_class = SurahSerializer
    permission_classes = [permissions.IsAuthenticated]

class SurahDetailView(generics.RetrieveAPIView):
    queryset = Surah.objects.all()
    serializer_class = SurahDetailSerializer
    lookup_field = 'number'
    permission_classes = [permissions.IsAuthenticated]

class SurahAyahListView(generics.ListAPIView):
    serializer_class = AyahSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        surah_number = self.kwargs.get('number')
        return Ayah.objects.filter(surah__number=surah_number).order_by('ayah_number_in_surah')

class JuzListView(generics.ListAPIView):
    queryset = Juz.objects.all().order_by('number')
    serializer_class = JuzSerializer
    permission_classes = [permissions.IsAuthenticated]

class JuzDetailView(generics.RetrieveAPIView):
    queryset = Juz.objects.all()
    serializer_class = JuzDetailSerializer
    lookup_field = 'number'
    permission_classes = [permissions.IsAuthenticated]

class BookmarkListCreateView(generics.ListCreateAPIView):
    serializer_class = UserBookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserBookmark.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = UserReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserReadingProgress.objects.filter(user=self.request.user).order_by('-updated_at')
    
    def post(self, request, *args, **kwargs):
        surah_id = request.data.get('surah')
        ayah_id = request.data.get('ayah')
        progress, created = UserReadingProgress.objects.update_or_create(
            user=request.user, surah_id=surah_id,
            defaults={'ayah_id': ayah_id}
        )
        return Response(self.get_serializer(progress).data)

class ReflectionListCreateView(generics.ListCreateAPIView):
    serializer_class = UserReflectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserReflection.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Helper for frontend expectations
from rest_framework.decorators import api_view, permission_classes
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recitation_list_stub(request):
    # Minimal stub to satisfy frontend
    return Response([{"id": 1, "name": "Mishary Alafasy", "reciter": "Alafasy"}])

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def translation_list_stub(request):
    return Response([{"id": 1, "name": "Sahih International", "language": "English"}])

# Admin Views
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_quran_stats(request):
    return Response({
        "surahs": Surah.objects.count(),
        "ayahs": Ayah.objects.count()
    })

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def admin_trigger_sync(request):
    from django.core.management import call_command
    try:
        call_command('import_quran')
        return Response({"message": "Synchronization completed successfully."})
    except Exception as e:
        return Response({"message": f"Sync failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def recitation_list_admin_stub(request):
    return Response([{
        "id": 1, 
        "name": "Mishary Alafasy", 
        "reciter": "Alafasy",
        "audio_base_url": "https://mirrors.quran.com/recitations/Alafasy",
        "is_active": True
    }])

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def translation_list_admin_stub(request):
    return Response([{
        "id": 1, 
        "name": "Sahih International", 
        "language": "English",
        "author": "Sahih International Project",
        "is_active": True
    }])
