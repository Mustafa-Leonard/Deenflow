from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "ok",
        "service": "DeenFlow API",
        "version": "1.0.4",
        "timestamp": "2026-03-15T00:40:00Z"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/auth/', include('accounts.urls')),
    path('api/quran/', include('quran.urls')),
    path('api/fiqh/', include('fiqh.urls')),
    path('api/audit/', include('audit.urls')),
    path('api/questions/', include('questions.urls')),
    path('api/answers/', include('answers.urls')),
    path('api/moderation/', include('moderation.urls')),
    path('api/flags/', include('flags.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/donations/', include('donations.urls')),
    path('api/consultation/', include('consultation.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/learning/', include('learning.urls')),
    path('api/sis/', include('spiritual_intelligence_service.urls')),
    # Worship Domain
    path('api/worship/', include('worship.urls')),
    # Messaging
    path('api/messaging/', include('messaging.urls')),
]
