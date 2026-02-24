from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import UserDeenPlan, Ruling, WorshipLog
from .serializers import DeenPlanSerializer, RulingSerializer
from .services import FiqhEngine
from .analytics_service import AnalyticsService

class DeenPlanDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = DeenPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        plan, _ = UserDeenPlan.objects.get_or_create(user=self.request.user)
        return plan

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def fiqh_consult(request):
    """
    POST { "ruling": "Salah for traveler", "is_traveling": true }
    """
    # Simple context building instead of non-existent .profile
    user = request.user
    user_context = {
        'full_name': user.full_name,
        'role': user.role,
        'theme': user.theme
    }
    user_context.update(request.data)
    
    engine = FiqhEngine(user_context)
    result = engine.get_applicable_ruling(request.data.get('ruling'))
    
    if result:
        return Response(result)
    return Response({'error': 'Ruling not found for your madhhab'}, status=404)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def worship_analytics(request):
    service = AnalyticsService(request.user)
    insight = service.generate_daily_insight()
    
    return Response({
        'score': insight.worship_score,
        'insight': insight.generated_text,
        'focus_area': insight.focus_area
    })

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def log_worship(request):
    """
    POST: Log an action: { "category": "salah_fajr" }
    GET: Return today's logged worship categories for the authenticated user.
    """
    if request.method == 'POST':
        log = WorshipLog.objects.create(
            user=request.user,
            category=request.data.get('category'),
            metadata=request.data.get('metadata', {})
        )
        return Response({'success': True, 'id': log.id})

    # GET: return today's worship logs (e.g., ['Fajr','Dhuhr'])
    from django.utils import timezone
    today = timezone.now().date()
    logs = WorshipLog.objects.filter(user=request.user, timestamp__date=today)
    prayers = []
    for l in logs:
        if l.category and l.category.startswith('salah_'):
            # category format: salah_fajr -> Fajr
            pname = l.category.split('_', 1)[-1].capitalize()
            prayers.append(pname)
    return Response({'prayers': prayers})
