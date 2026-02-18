from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from accounts.models import User
from accounts.serializers import ProfileSerializer
from guidance.models import GuidanceRequest, SavedReflection
from guidance.serializers import GuidanceRequestSerializer, SavedReflectionSerializer
from datetime import datetime, timedelta

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_users_list(request):
    """List all users - admin only"""
    users = User.objects.all().order_by('-date_joined')
    serializer = ProfileSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_guidance_list(request):
    """List all guidance requests - admin only"""
    guidance = GuidanceRequest.objects.all().order_by('-created_at')
    serializer = GuidanceRequestSerializer(guidance, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_reflections_list(request):
    """List all saved reflections - admin only"""
    reflections = SavedReflection.objects.all().order_by('-created_at')
    serializer = SavedReflectionSerializer(reflections, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_stats(request):
    """Get admin dashboard statistics"""
    today = datetime.now().date()
    
    total_users = User.objects.count()
    questions_today = GuidanceRequest.objects.filter(created_at__date=today).count()
    pending_reviews = GuidanceRequest.objects.filter(reviewed=False).count()
    flagged_ai_answers = GuidanceRequest.objects.filter(flagged=True).count()
    
    return Response({
        'totalUsers': total_users,
        'questionsToday': questions_today,
        'pendingReviews': pending_reviews,
        'flaggedAIAnswers': flagged_ai_answers
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_recent_activity(request):
    """Get recent AI activity"""
    recent_guidance = GuidanceRequest.objects.all().order_by('-created_at')[:10]
    
    activity = []
    for guidance in recent_guidance:
        activity.append({
            'id': guidance.id,
            'question': guidance.input_text,
            'user': guidance.user.email if guidance.user else 'Anonymous',
            'timestamp': guidance.created_at.strftime('%Y-%m-%d %H:%M'),
            'flagged': guidance.flagged
        })
    
    return Response(activity)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_pending_reviews(request):
    """Get pending content reviews"""
    pending = GuidanceRequest.objects.filter(reviewed=False).order_by('-created_at')[:20]
    results = []
    for item in pending:
        results.append({
            'id': item.id,
            'title': item.input_text[:50] + '...',
            'author': item.user.email if item.user else 'Anonymous',
            'date': item.created_at.strftime('%Y-%m-%d')
        })
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_top_topics(request):
    """Get most searched topics"""
    from django.db.models import Count
    topic_counts = GuidanceRequest.objects.values('category').annotate(count=Count('category')).order_by('-count')[:5]
    
    topics = []
    for tc in topic_counts:
        category = tc['category'] or 'General'
        topics.append({'name': category, 'count': tc['count']})
    
    # Fallback to defaults if empty
    if not topics:
        topics = [
            {'name': 'Prayer (Salah)', 'count': 0},
            {'name': 'Fasting (Sawm)', 'count': 0}
        ]
        
    return Response(topics)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_logs(request):
    """Get AI interaction logs with filters"""
    # Get all guidance requests (AI interactions)
    logs = GuidanceRequest.objects.all().order_by('-created_at')
    
    # Apply filters
    search = request.GET.get('search', '')
    date_from = request.GET.get('dateFrom', '')
    date_to = request.GET.get('dateTo', '')
    flagged = request.GET.get('flagged', '')
    
    if search:
        logs = logs.filter(input_text__icontains=search)
    if date_from:
        logs = logs.filter(created_at__date__gte=date_from)
    if date_to:
        logs = logs.filter(created_at__date__lte=date_to)
    
    # Pagination
    page = int(request.GET.get('page', 1))
    per_page = 20
    start = (page - 1) * per_page
    end = start + per_page
    
    results = []
    for log in logs[start:end]:
        results.append({
            'id': log.id,
            'created_at': log.created_at.isoformat(),
            'user_email': log.user.email if log.user else 'Anonymous',
            'input_text': log.input_text,
            'model': 'GPT-4',
            'flagged': log.flagged,
            'reviewed': log.reviewed
        })
    
    return Response({
        'results': results,
        'count': logs.count()
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_log_detail(request, log_id):
    """Get detailed AI interaction"""
    try:
        log = GuidanceRequest.objects.get(id=log_id)
        # Construct ai_response string from JSON if available
        ai_response = ""
        if log.response_json:
             # Basic summary for admin view
             parts = []
             for k, v in log.response_json.items():
                 if isinstance(v, list) and v:
                     parts.append(f"### {k.capitalize()}\n" + "\n".join([f"- {i}" for i in v]))
             ai_response = "\n\n".join(parts)
             
        return Response({
            'id': log.id,
            'created_at': log.created_at.isoformat(),
            'user_id': log.user.id if log.user else None,
            'user_email': log.user.email if log.user else 'Anonymous',
            'input_text': log.input_text,
            'ai_response': ai_response,
            'category': log.category or 'General',
            'model': 'GPT-4',
            'system_prompt': 'You are an Islamic guidance assistant...',
            'references': [],
            'flagged': log.flagged,
            'reviewed': log.reviewed,
            'flag_reason': log.flag_reason
        })
    except GuidanceRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_log_action(request, log_id):
    """Perform action on AI interaction"""
    action = request.data.get('action')
    notes = request.data.get('notes', '')
    
    try:
        log = GuidanceRequest.objects.get(id=log_id)
        if action == 'flag':
            log.flagged = True
            log.flag_reason = notes
        elif action == 'mark_correct':
            log.flagged = False
            log.reviewed = True
        elif action == 'send_to_scholar':
            log.reviewed = False # Requires further attention
            # Implement escalation logic
        
        log.save()
        return Response({'success': True, 'action': action})
    except GuidanceRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_flagged(request):
    """Get flagged AI answers"""
    flagged = GuidanceRequest.objects.filter(flagged=True).order_by('-created_at')
    
    results = []
    for log in flagged:
        # Construction of ai_response string from JSON
        ai_response = ""
        if log.response_json:
             parts = []
             for k, v in log.response_json.items():
                 if isinstance(v, list) and v:
                     parts.append(f"{k.capitalize()}: {v[0][:100]}...")
             ai_response = " | ".join(parts)

        results.append({
            'id': log.id,
            'created_at': log.created_at.isoformat(),
            'flagged_at': log.created_at.isoformat(), # Using created_at for now
            'user_email': log.user.email if log.user else 'Anonymous',
            'input_text': log.input_text,
            'ai_response': ai_response,
            'flag_reason': log.flag_reason
        })
    return Response(results)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_flagged_resolve(request, answer_id):
    """Resolve flagged answer"""
    action = request.data.get('action')
    notes = request.data.get('notes', '')
    
    try:
        log = GuidanceRequest.objects.get(id=answer_id)
        if action == 'approve':
            log.flagged = False
            log.reviewed = True
        elif action == 'remove':
            log.delete()
            return Response({'success': True})
        
        log.save()
        return Response({'success': True})
    except GuidanceRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_content_list(request):
    """List all content"""
    # Currently we don't have a dedicated Content model for articles.
    # We can return some static educational content or guidance requests.
    content = [
        {
            'id': 1,
            'title': 'Ethics of AI in Islam',
            'slug': 'ai-ethics-islam',
            'category': 'ethics',
            'author': 'DeenFlow Editorial',
            'status': 'published',
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 2,
            'title': 'The Importance of Context in Fatawa',
            'slug': 'context-in-fatawa',
            'category': 'fiqh',
            'author': 'Scholar Board',
            'status': 'review',
            'updated_at': datetime.now().isoformat()
        }
    ]
    return Response(content)
