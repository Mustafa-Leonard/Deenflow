from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScholarViewSet, ConsultationSessionViewSet

router = DefaultRouter()
router.register(r'scholars', ScholarViewSet, basename='scholar')
router.register(r'sessions', ConsultationSessionViewSet, basename='consultation-session')

urlpatterns = [
    path('', include(router.urls)),
]
