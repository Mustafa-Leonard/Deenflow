from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from datetime import datetime, timedelta
from .models import User
from guidance.models import GuidanceRequest, SavedReflection

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def member_stats(request):
    """Get member dashboard statistics"""
    user = request.user
    
    # Calculate stats
    total_questions = GuidanceRequest.objects.filter(user=user).count()
    saved_items = SavedReflection.objects.filter(user=user).count()
    
    # Mock learning progress and community participation for now
    learning_progress = 60  # Will be calculated from actual learning data
    community_participation = 150  # Will be calculated from actual community data
    
    return Response({
        'totalQuestions': total_questions,
        'savedItems': saved_items,
        'learningProgress': learning_progress,
        'communityParticipation': community_participation
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_ayah(request):
    """Get daily Ayah from the database"""
    from quran.models import Ayah
    import random
    
    # Try to get a random ayah from the first 3 surahs for better quality daily snippets
    ayahs = Ayah.objects.filter(surah__number__lte=3)
    if ayahs.exists():
        ayah = random.choice(ayahs)
        return Response({
            'id': ayah.id,
            'arabic': ayah.text_arabic,
            'translation': ayah.text_translation_en,
            'reference': f"Surah {ayah.surah.name_english} {ayah.surah.number}:{ayah.ayah_number_in_surah}",
            'surah_number': ayah.surah.number
        })
    
    return Response({
        'arabic': 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        'translation': 'In the name of Allah, the Most Gracious, the Most Merciful',
        'reference': 'Quran 1:1',
        'surah_number': 1
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def suggested_topics(request):
    """Get suggested learning topics"""
    # This would fetch from actual topics database
    topics = [
        {'name': 'Introduction to Tafsir', 'slug': 'intro-tafsir', 'icon': '📖', 'lessons_count': 12},
        {'name': 'Fiqh Basics', 'slug': 'fiqh-basics', 'icon': '⚖️', 'lessons_count': 8},
        {'name': 'Aqeedah Fundamentals', 'slug': 'aqeedah-fundamentals', 'icon': '🕌', 'lessons_count': 15},
        {'name': 'Hadith Sciences', 'slug': 'hadith-sciences', 'icon': '📚', 'lessons_count': 10},
        {'name': 'Islamic History', 'slug': 'islamic-history', 'icon': '🏛️', 'lessons_count': 20}
    ]
    return Response(topics)
