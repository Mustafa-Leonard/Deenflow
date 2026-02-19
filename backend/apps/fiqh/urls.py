from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FiqhRulingViewSet

router = DefaultRouter()
router.register(r'rulings', FiqhRulingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
