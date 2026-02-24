from django.urls import path
from .views import RegisterView, profile_view
from .admin_views import (
    admin_users_list, admin_user_detail, admin_dashboard_stats, admin_recent_activity, admin_ai_logs,
    admin_pending_reviews, admin_top_topics, admin_ai_log_detail, admin_ai_log_action,
    admin_dashboard_export, admin_system_health, admin_dashboard_overview
)
from .admin_extended_views import (
    admin_ai_config,
    admin_scholars, admin_scholar_detail, admin_scholar_assign,
    admin_roles, admin_permissions, admin_role_permissions,
    admin_moderation_reports, admin_moderation_action,
    admin_categories, admin_tags,
    admin_content, admin_content_detail, admin_content_review, admin_content_approve, admin_content_reject,
    admin_flagged_answers, admin_flagged_resolve,
    admin_analytics_questions, admin_analytics_flag_rate, admin_analytics_active_users,
    admin_audit_logs,
    newsletter_subscribe, contact_message,
)

from .member_views import member_stats, daily_ayah, suggested_topics, member_recent_questions, member_dashboard_extras, member_dashboard_overview
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
    path('admin/dashboard/export/', admin_dashboard_export, name='admin_dashboard_export'),
    path('admin/dashboard/health/', admin_system_health, name='admin_system_health'),
    path('admin/dashboard/overview/', admin_dashboard_overview, name='admin_dashboard_overview'),
    
    # Admin endpoints - Users
    path('admin/users/', admin_users_list, name='admin_users'),
    path('admin/users/<int:user_id>/', admin_user_detail, name='admin_user_detail'),
    
    # Admin endpoints - AI Supervision
    path('admin/ai/logs/', admin_ai_logs, name='admin_ai_logs'),
    path('admin/ai/logs/<int:log_id>/', admin_ai_log_detail, name='admin_ai_log_detail'),
    path('admin/ai/logs/<int:log_id>/action/', admin_ai_log_action, name='admin_ai_log_action'),
    path('admin/ai/flagged/', admin_flagged_answers, name='admin_flagged_answers'),
    path('admin/ai/flagged/<int:flag_id>/resolve/', admin_flagged_resolve, name='admin_flagged_resolve'),
    
    # Admin endpoints - AI Configuration
    path('admin/ai-config/', admin_ai_config, name='admin_ai_config'),
    
    # Admin endpoints - Scholars Management
    path('admin/scholars/', admin_scholars, name='admin_scholars'),
    path('admin/scholars/<int:scholar_id>/', admin_scholar_detail, name='admin_scholar_detail'),
    path('admin/scholars/<int:scholar_id>/assign-task/', admin_scholar_assign, name='admin_scholar_assign'),
    
    # Admin endpoints - Roles & Permissions
    path('admin/roles/', admin_roles, name='admin_roles'),
    path('admin/permissions/', admin_permissions, name='admin_permissions'),
    path('admin/roles/<int:role_id>/permissions/', admin_role_permissions, name='admin_role_permissions'),
    
    # Admin endpoints - Moderation
    path('admin/moderation/reports/', admin_moderation_reports, name='admin_moderation_reports'),
    path('admin/moderation/reports/<int:report_id>/action/', admin_moderation_action, name='admin_moderation_action'),
    
    # Admin endpoints - Categories & Tags
    path('admin/categories/', admin_categories, name='admin_categories'),
    path('admin/tags/', admin_tags, name='admin_tags'),
    
    # Admin endpoints - Content Management
    path('admin/content/', admin_content, name='admin_content_list'),
    path('admin/content/<int:content_id>/', admin_content_detail, name='admin_content_detail'),
    path('admin/content/<int:content_id>/submit-review/', admin_content_review, name='admin_content_review'),
    path('admin/content/<int:content_id>/approve/', admin_content_approve, name='admin_content_approve'),
    path('admin/content/<int:content_id>/reject/', admin_content_reject, name='admin_content_reject'),
    
    # Admin endpoints - Analytics
    path('admin/analytics/questions-per-day/', admin_analytics_questions, name='admin_analytics_questions'),
    path('admin/analytics/ai-flag-rate/', admin_analytics_flag_rate, name='admin_analytics_flag_rate'),
    path('admin/analytics/active-users/', admin_analytics_active_users, name='admin_analytics_active_users'),
    
    # Admin endpoints - Audit Logs
    path('admin/audit-logs/', admin_audit_logs, name='admin_audit_logs'),
    
    # Member endpoints
    path('member/stats/', member_stats, name='member_stats'),
    path('member/recent/', member_recent_questions, name='member_recent'),
    path('member/daily-ayah/', daily_ayah, name='daily_ayah'),
    path('member/suggested-topics/', suggested_topics, name='suggested_topics'),
    path('member/extras/', member_dashboard_extras, name='member_extras'),
    path('member/dashboard-overview/', member_dashboard_overview, name='dashboard_overview'),
    
    # Public Utility
    path('newsletter/subscribe/', newsletter_subscribe, name='newsletter_subscribe'),
    path('contact/', contact_message, name='contact_message'),
]

