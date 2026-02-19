from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
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
]
