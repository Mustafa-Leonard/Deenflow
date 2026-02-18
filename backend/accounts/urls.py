from django.urls import path
from .views import RegisterView, profile_view
from .admin_views import (
    admin_users_list, admin_guidance_list, admin_reflections_list,
    admin_dashboard_stats, admin_recent_activity, admin_pending_reviews, admin_top_topics,
    admin_ai_logs, admin_ai_log_detail, admin_ai_log_action,
    admin_ai_flagged, admin_ai_flagged_resolve, admin_content_list
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', profile_view, name='profile'),
    
    # Admin endpoints - Dashboard
    path('admin/dashboard/stats/', admin_dashboard_stats, name='admin_dashboard_stats'),
    path('admin/dashboard/recent-activity/', admin_recent_activity, name='admin_recent_activity'),
    path('admin/dashboard/pending-reviews/', admin_pending_reviews, name='admin_pending_reviews'),
    path('admin/dashboard/top-topics/', admin_top_topics, name='admin_top_topics'),
    
    # Admin endpoints - Users & Data
    path('admin/users/', admin_users_list, name='admin_users'),
    path('admin/guidance/', admin_guidance_list, name='admin_guidance'),
    path('admin/reflections/', admin_reflections_list, name='admin_reflections'),
    
    # Admin endpoints - AI Supervision
    path('admin/ai/logs/', admin_ai_logs, name='admin_ai_logs'),
    path('admin/ai/logs/<int:log_id>/', admin_ai_log_detail, name='admin_ai_log_detail'),
    path('admin/ai/logs/<int:log_id>/action/', admin_ai_log_action, name='admin_ai_log_action'),
    path('admin/ai/flagged/', admin_ai_flagged, name='admin_ai_flagged'),
    path('admin/ai/flagged/<int:answer_id>/resolve/', admin_ai_flagged_resolve, name='admin_ai_flagged_resolve'),
    
    # Admin endpoints - Content
    path('admin/content/', admin_content_list, name='admin_content_list'),
]
