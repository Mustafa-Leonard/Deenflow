from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/guidance/', include('guidance.urls')),
    path('api/quran/', include('quran.urls')),
    path('api/sis/', include('spiritual_intelligence_service.urls')),
    path('api/learning/', include('learning.urls')),
]
