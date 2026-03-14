from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from datetime import datetime
import json


# ========== AI Configuration ==========

AI_CONFIG_STORE = {}

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_ai_config(request):
    """Get or update AI configuration"""
    if request.method == 'GET':
        return Response(AI_CONFIG_STORE or {})
    
    AI_CONFIG_STORE.update(request.data)
    return Response({'status': 'success', 'message': 'AI configuration updated'})


# ========== Scholars Management ==========

SCHOLARS_STORE = []

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_scholars(request):
    """List or add scholars"""
    if request.method == 'GET':
        return Response(SCHOLARS_STORE)
    
    scholar_data = request.data
    scholar_data['id'] = len(SCHOLARS_STORE) + 1
    scholar_data['status'] = 'active'
    scholar_data['reviewsCompleted'] = 0
    scholar_data['reviewsPending'] = 0
    scholar_data['joinedAt'] = datetime.now().strftime('%Y-%m-%d')
    scholar_data['rating'] = 0
    SCHOLARS_STORE.append(scholar_data)
    return Response(scholar_data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_scholar_detail(request, scholar_id):
    """Update a scholar"""
    for i, scholar in enumerate(SCHOLARS_STORE):
        if scholar.get('id') == scholar_id:
            SCHOLARS_STORE[i].update(request.data)
            return Response(SCHOLARS_STORE[i])
    return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_scholar_assign(request, scholar_id):
    """Assign a review task to a scholar"""
    task_type = request.data.get('task_type', '')
    priority = request.data.get('priority', 'normal')
    note = request.data.get('note', '')
    
    return Response({
        'status': 'success',
        'message': f'Task assigned to scholar {scholar_id}',
        'task_type': task_type,
        'priority': priority,
    })


# ========== Roles & Permissions ==========

ROLES_STORE = []

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_roles(request):
    """List or create roles"""
    if request.method == 'GET':
        return Response(ROLES_STORE)
    
    role_data = request.data
    role_data['id'] = len(ROLES_STORE) + 1
    ROLES_STORE.append(role_data)
    return Response(role_data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_permissions(request):
    """List all available permissions"""
    permissions = {
        'dashboard': ['view', 'export'],
        'content': ['view', 'create', 'edit', 'delete', 'approve', 'reject'],
        'ai': ['view_logs', 'flag', 'configure', 'review'],
        'users': ['view', 'create', 'edit', 'suspend', 'delete'],
        'scholars': ['view', 'add', 'assign', 'remove'],
        'moderation': ['view', 'action', 'dismiss'],
        'analytics': ['view', 'export'],
        'audit': ['view', 'export'],
        'settings': ['view', 'edit'],
    }
    return Response(permissions)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_role_permissions(request, role_id):
    """Update role permissions"""
    for i, role in enumerate(ROLES_STORE):
        if role.get('id') == role_id:
            ROLES_STORE[i]['permissions'] = request.data
            return Response({'status': 'success'})
    return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== Moderation ==========

REPORTS_STORE = []

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_moderation_reports(request):
    """List reported content"""
    return Response(REPORTS_STORE)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_moderation_action(request, report_id):
    """Take action on a report"""
    action = request.data.get('action', '')
    notes = request.data.get('notes', '')
    
    for i, report in enumerate(REPORTS_STORE):
        if report.get('id') == report_id:
            REPORTS_STORE[i]['status'] = 'dismissed' if action == 'dismiss' else 'resolved'
            REPORTS_STORE[i]['resolvedBy'] = request.user.email
            REPORTS_STORE[i]['resolvedAt'] = datetime.now().isoformat()
            REPORTS_STORE[i]['resolution'] = notes
            return Response({'status': 'success'})
    
    return Response({'status': 'success', 'message': f'Action {action} taken on report {report_id}'})


# ========== Categories & Tags ==========

CATEGORIES_STORE = []
TAGS_STORE = []

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_categories(request):
    """List or create categories"""
    if request.method == 'GET':
        return Response(CATEGORIES_STORE)
    
    cat_data = request.data
    cat_data['id'] = len(CATEGORIES_STORE) + 1
    CATEGORIES_STORE.append(cat_data)
    return Response(cat_data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_tags(request):
    """List or create tags"""
    if request.method == 'GET':
        return Response(TAGS_STORE)
    
    tag_data = request.data
    tag_data['id'] = len(TAGS_STORE) + 1
    TAGS_STORE.append(tag_data)
    return Response(tag_data, status=status.HTTP_201_CREATED)


# ========== Content Management ==========

CONTENT_STORE = []

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_content(request):
    """List or create content (mapping to LearningPath/Career Notes)"""
    from learning.models import LearningPath
    from django.db.models import Q
    
    if request.method == 'GET':
        search = request.GET.get('search', '')
        status_filter = request.GET.get('status', '')
        category_filter = request.GET.get('category', '')
        
        paths = LearningPath.objects.all().order_by('-created_at')
        
        if search:
            paths = paths.filter(Q(title__icontains=search) | Q(slug__icontains=search))
        
        if status_filter:
            if status_filter == 'published':
                paths = paths.filter(is_published=True)
            elif status_filter == 'draft':
                paths = paths.filter(is_published=False)
        
        # Note: LearningPath doesn't have a 'category' field in the model yet, 
        # so we assume all are 'Academy' for now for the list view logic.
        
        results = []
        for p in paths:
            results.append({
                'id': p.id,
                'title': p.title,
                'slug': p.slug,
                'category': 'Academy',
                'author': 'Content Team',
                'status': 'published' if p.is_published else 'draft',
                'is_premium': p.is_premium,
                'updated_at': p.created_at.isoformat()
            })
        return Response(results)
    
    # POST - Create new LearningPath
    try:
        data = request.data
        path = LearningPath.objects.create(
            title=data.get('title'),
            slug=data.get('slug') or data.get('title').lower().replace(' ', '-'),
            description=data.get('body', '')[:200], # basic mapping
            difficulty='beginner',
            is_published=data.get('status') == 'published'
        )
        return Response({'id': path.id, 'status': 'success'}, status=201)
    except Exception as e:
        return Response({'detail': str(e)}, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_content_detail(request, content_id):
    """Get, update, or delete content"""
    from learning.models import LearningPath
    try:
        path = LearningPath.objects.get(id=content_id)
        if request.method == 'GET':
            return Response({
                'id': path.id,
                'title': path.title,
                'slug': path.slug,
                'body': path.description, # Mapping description to body for the editor
                'description': path.description,
                'category': 'Academy',
                'status': 'published' if path.is_published else 'draft',
                'is_published': path.is_published,
                'is_premium': path.is_premium,
                'difficulty': path.difficulty,
                'thumbnail': path.thumbnail,
                'tags': [], # No tags in model yet
                'sources': [] # No sources in model yet
            })
        elif request.method == 'PUT':
            data = request.data
            path.title = data.get('title', path.title)
            path.slug = data.get('slug', path.slug)
            path.description = data.get('body', path.description)
            path.is_published = data.get('status') == 'published'
            path.is_premium = data.get('is_premium', path.is_premium)
            path.save()
            return Response({'status': 'success'})
        elif request.method == 'DELETE':
            path.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    except LearningPath.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_content_review(request, content_id):
    """Submit content for review"""
    for i, item in enumerate(CONTENT_STORE):
        if item.get('id') == content_id:
            CONTENT_STORE[i]['status'] = 'review'
            return Response({'status': 'success'})
    return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_content_approve(request, content_id):
    """Approve content"""
    for i, item in enumerate(CONTENT_STORE):
        if item.get('id') == content_id:
            CONTENT_STORE[i]['status'] = 'published'
            return Response({'status': 'success'})
    return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_content_reject(request, content_id):
    """Reject content"""
    for i, item in enumerate(CONTENT_STORE):
        if item.get('id') == content_id:
            CONTENT_STORE[i]['status'] = 'rejected'
            return Response({'detail': 'success'})
    return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== Flagged AI Answers ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_flagged_answers(request):
    """List flagged AI answers"""
    from flags.models import Flag
    
    flags = Flag.objects.filter(status='active').order_by('-created_at')[:50]
    results = []
    for flag in flags:
        results.append({
            'id': flag.id,
            'content_type': flag.content_type,
            'object_id': flag.object_id,
            'reason': flag.reason,
            'status': flag.status,
            'created_at': flag.created_at.isoformat() if hasattr(flag, 'created_at') else None,
        })
    return Response(results)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_flagged_resolve(request, flag_id):
    """Resolve a flagged answer"""
    from flags.models import Flag
    
    try:
        flag = Flag.objects.get(id=flag_id)
        action = request.data.get('action', 'resolve')
        flag.status = 'resolved'
        flag.save()
        return Response({'status': 'success'})
    except Flag.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== Analytics ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_analytics_questions(request):
    """Questions per day analytics"""
    data = [
        {'date': '2026-02-13', 'count': 45},
        {'date': '2026-02-14', 'count': 52},
        {'date': '2026-02-15', 'count': 38},
        {'date': '2026-02-16', 'count': 61},
        {'date': '2026-02-17', 'count': 49},
        {'date': '2026-02-18', 'count': 67},
        {'date': '2026-02-19', 'count': 54},
    ]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_analytics_flag_rate(request):
    """AI flag rate analytics"""
    return Response({
        'current_rate': 0.08,
        'previous_rate': 0.12,
        'trend': 'decreasing',
        'total_flagged': 34,
        'total_answered': 425,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser]) 
def admin_analytics_active_users(request):
    """Active users analytics"""
    return Response({
        'daily_active': 234,
        'weekly_active': 892,
        'monthly_active': 2341,
        'trend': 'increasing',
    })


# ========== Audit Logs ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_audit_logs(request):
    """List audit logs with filters"""
    from audit.models import AuditLog
    
    logs = AuditLog.objects.all().order_by('-created_at')
    
    # Optional filters
    action = request.GET.get('action', '')
    if action:
        logs = logs.filter(action__icontains=action)
    
    user_filter = request.GET.get('user', '')
    if user_filter:
        logs = logs.filter(user__email__icontains=user_filter)
    
    results = []
    for log in logs[:100]:
        results.append({
            'id': log.id,
            'user': log.user.email if hasattr(log, 'user') and log.user else 'System',
            'action': log.action,
            'details': log.details if hasattr(log, 'details') else '',
            'created_at': log.created_at.isoformat(),
        })
    
    return Response({
        'results': results,
        'count': logs.count(),
    })


# ========== Public / Utility ==========

@api_view(['POST'])
def newsletter_subscribe(request):
    """Subscribe to the newsletter"""
    email = request.data.get('email', '')
    if not email:
        return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_VALUE)
    
    # In a real app, save to DB. For now, just return success.
    return Response({'status': 'success', 'message': f'Subscribed {email} successfully'})


@api_view(['POST'])
def contact_message(request):
    """Receive contact form messages"""
    data = request.data
    # In a real app, save to DB or send email.
    return Response({'status': 'success', 'message': 'Message received'})

