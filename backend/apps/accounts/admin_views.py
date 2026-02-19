from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from accounts.models import User
from accounts.serializers import ProfileSerializer
from questions.models import Question
from questions.serializers import QuestionSerializer
from answers.models import DraftAnswer, Answer
from flags.models import Flag
from datetime import datetime, timedelta

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_users_list(request):
    """List or create users - admin only"""
    if request.method == 'GET':
        users = User.objects.all().order_by('-date_joined')
        serializer = ProfileSerializer(users, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        from accounts.serializers import RegisterSerializer
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Handle additional admin fields
            if 'role' in request.data:
                user.role = request.data['role']
                # Administrative roles get is_staff
                if user.role in ['super_admin', 'content_admin', 'fiqh_reviewer', 'moderator']:
                    user.is_staff = True
                else:
                    user.is_staff = False
            
            if 'madhhab' in request.data:
                user.madhhab = request.data['madhhab']
            
            user.save()
            return Response(ProfileSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_user_detail(request, user_id):
    """Manage a specific user"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(ProfileSerializer(user).data)
    
    elif request.method == 'PATCH':
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            u = serializer.save()
            
            # Handle role-based staff status
            if 'role' in request.data:
                u.role = request.data['role']
                if u.role in ['super_admin', 'content_admin', 'fiqh_reviewer', 'moderator']:
                    u.is_staff = True
                else:
                    u.is_staff = False
                u.save()
            elif 'is_admin' in request.data:
                # Legacy support for the boolean flag
                u.is_staff = request.data['is_admin']
                if u.is_staff:
                    u.role = 'super_admin'
                else:
                    u.role = 'member'
                u.save()
            return Response(ProfileSerializer(u).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if user == request.user:
            return Response({'detail': 'Cannot delete your own account'}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_stats(request):
    """Get admin dashboard statistics"""
    today = datetime.now().date()
    
    total_users = User.objects.count()
    questions_today = Question.objects.filter(created_at__date=today).count()
    pending_reviews = DraftAnswer.objects.filter(status='draft').count()
    flagged_ai_answers = Flag.objects.filter(status='active').count()
    
    return Response({
        'totalUsers': total_users,
        'questionsToday': questions_today,
        'pendingReviews': pending_reviews,
        'flaggedAIAnswers': flagged_ai_answers
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_recent_activity(request):
    """Get recent activity from questions and answers"""
    recent_questions = Question.objects.all().order_by('-created_at')[:10]
    
    activity = []
    for q in recent_questions:
        activity.append({
            'id': q.id,
            'question': q.text[:100],
            'user': q.user.email if q.user else 'Anonymous',
            'timestamp': q.created_at.strftime('%Y-%m-%d %H:%M'),
            'status': q.status
        })
    
    return Response(activity)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_logs(request):
    """Get Question logs with filters"""
    logs = Question.objects.all().order_by('-created_at')
    
    # Simple search
    search = request.GET.get('search', '')
    if search:
        logs = logs.filter(text__icontains=search)
    
    results = []
    for log in logs[:100]:
        results.append({
            'id': log.id,
            'created_at': log.created_at.isoformat(),
            'user_email': log.user.email if log.user else 'Anonymous',
            'input_text': log.text,
            'status': log.status
        })
    
    return Response({
        'results': results,
        'count': logs.count()
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_pending_reviews(request):
    """Get pending content reviews from DraftAnswer"""
    pending = DraftAnswer.objects.filter(status='draft').order_by('-created_at')[:10]
    results = []
    for item in pending:
        results.append({
            'id': item.id,
            'title': item.question.text[:50] + '...',
            'author': item.question.user.email if item.question.user else 'Anonymous',
            'date': item.created_at.strftime('%Y-%m-%d')
        })
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_top_topics(request):
    """Get frequent topics from questions"""
    # This is a mock for now since topics are in JSON or separate model
    topics = [
        {'name': 'Finance & Riba', 'count': 452},
        {'name': 'Family Law', 'count': 312},
        {'name': 'Prayer (Salah)', 'count': 228},
        {'name': 'Fasting Rules', 'count': 184},
        {'name': 'Inheritance', 'count': 124},
    ]
    return Response(topics)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_log_detail(request, log_id):
    """Get detail for a specific AI log (Question)"""
    try:
        q = Question.objects.get(id=log_id)
        # Try to find associated draft or answer
        draft = DraftAnswer.objects.filter(question=q).first()
        answer = Answer.objects.filter(question=q).first()
        
        return Response({
            'id': q.id,
            'created_at': q.created_at,
            'user_id': q.user.id if q.user else None,
            'user_email': q.user.email if q.user else 'Anonymous',
            'input_text': q.text,
            'output_text': draft.draft_text if draft else (answer.text if answer else "No answer generated yet"),
            'status': q.status,
            'model': 'GPT-4 (RAG)',
            'flagged': q.status == 'flagged',
        })
    except Question.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_log_action(request, log_id):
    """Perform action on an AI log"""
    action = request.data.get('action')
    notes = request.data.get('notes', '')
    
    try:
        q = Question.objects.get(id=log_id)
        if action == 'flag':
            q.status = 'flagged'
            q.save()
            Flag.objects.create(
                content_type='question',
                object_id=q.id,
                reason=notes or 'Flagged by admin'
            )
        elif action == 'mark_correct':
            q.status = 'processed'
            q.save()
            
        return Response({'status': 'success'})
    except Question.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_export(request):
    """Export dashboard report as CSV"""
    import csv
    from django.http import HttpResponse
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="deenflow-report.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Date', 'Metric', 'Value'])
    writer.writerow([datetime.now().strftime('%Y-%m-%d'), 'Total Users', User.objects.count()])
    writer.writerow([datetime.now().strftime('%Y-%m-%d'), 'Pending Reviews', DraftAnswer.objects.filter(status='draft').count()])
    
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_system_health(request):
    """Check system health status"""
    from django.db import connection
    
    db_status = 'online'
    try:
        connection.ensure_connection()
    except Exception:
        db_status = 'offline'
        
    return Response({
        'status': 'optimal' if db_status == 'online' else 'degraded',
        'database': db_status,
        'cache': 'online',
        'storage': 'online',
        'timestamp': datetime.now().isoformat()
    })
