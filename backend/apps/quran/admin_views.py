from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.core.cache import cache
from django.core.management import call_command
from .models import Surah, Ayah, TranslationSource, RecitationSource
from .serializers import (
    SurahSerializer, AyahSerializer, TranslationSourceSerializer, RecitationSourceSerializer
)

class AdminSurahListView(generics.ListAPIView):
    queryset = Surah.objects.all()
    serializer_class = SurahSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class AdminAyahListView(generics.ListAPIView):
    queryset = Ayah.objects.all()
    serializer_class = AyahSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class AdminTranslationListCreateView(generics.ListCreateAPIView):
    queryset = TranslationSource.objects.all()
    serializer_class = TranslationSourceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class AdminTranslationDetailView(generics.RetrieveUpdateAPIView):
    queryset = TranslationSource.objects.all()
    serializer_class = TranslationSourceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class AdminRecitationListCreateView(generics.ListCreateAPIView):
    queryset = RecitationSource.objects.all()
    serializer_class = RecitationSourceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class AdminRecitationDetailView(generics.RetrieveUpdateAPIView):
    queryset = RecitationSource.objects.all()
    serializer_class = RecitationSourceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
def admin_quran_sync(request):
    """Trigger the Qur'an import/sync pipeline"""
    try:
        # In a real system, this might be asynchronous (Celery)
        # For simplicity in this demo, we'll call it synchronously
        call_command('import_quran')
        
        # Invalidate cache
        cache.clear()
        
        return Response({'status': 'success', 'message': 'Qur\'an synchronization completed.'})
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
def admin_quran_sync_status(request):
    """Check sync status"""
    # This could check a log table or cache
    sync_logs = cache.get('quran_sync_logs', 'No recent sync logs found.')
    return Response({'status': 'done', 'logs': sync_logs})
