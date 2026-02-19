from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from datetime import datetime, timedelta
from .models import User
from questions.models import Question

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def member_stats(request):
    """Get member dashboard statistics"""
    user = request.user
    from answers.models import SavedAnswer
    from spiritual_intelligence_service.models import Streak, DailyInsight
    
    # Calculate stats
    total_questions = Question.objects.filter(user=user).count()
    saved_items = SavedAnswer.objects.filter(user=user).count()
    
    # Get latest streaks
    salah_streak = Streak.objects.filter(user=user, category='Daily Prayer').first()
    salah_streak_val = salah_streak.current_count if salah_streak else 0
    
    # Get overall consistency (mocked for now based on latest insight)
    latest_insight = DailyInsight.objects.filter(user=user).order_by('-date').first()
    consistency_score = latest_insight.worship_score if latest_insight else 0
    
    return Response({
        'totalQuestions': total_questions,
        'savedItems': saved_items,
        'learningProgress': consistency_score, # Using score as progress for now
        'communityParticipation': 150, # Mock
        'salahStreak': salah_streak_val
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def member_recent_questions(request):
    """Get member's recent questions"""
    questions = Question.objects.filter(user=request.user).order_by('-created_at')[:5]
    results = []
    for q in questions:
        results.append({
            'id': q.id,
            'input_text': q.text,
            'created_at': q.created_at,
            'status': q.status,
            'category': 'General'
        })
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def member_dashboard_extras(request):
    """Get extra dashboard info like wallet and upcoming sessions"""
    user = request.user
    from donations.models import Wallet, Campaign
    from consultation.models import ConsultationSession
    
    wallet, _ = Wallet.objects.get_or_create(user=user)
    upcoming_session = ConsultationSession.objects.filter(member=user, status='confirmed', scheduled_at__gte=datetime.now()).first()
    featured_campaign = Campaign.objects.filter(is_active=True).first()
    
    return Response({
        'walletBalance': wallet.balance,
        'upcomingSession': {
            'scholar': upcoming_session.scholar.user.full_name,
            'time': upcoming_session.scheduled_at
        } if upcoming_session else None,
        'featuredCampaign': {
            'title': featured_campaign.title,
            'progress': float(featured_campaign.current_amount / featured_campaign.target_amount * 100) if featured_campaign else 0
        } if featured_campaign else None
    })
