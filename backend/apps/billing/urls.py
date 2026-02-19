from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionViewSet, SubscriptionTierViewSet

router = DefaultRouter()
router.register(r'tiers', SubscriptionTierViewSet, basename='subscription-tier')
router.register(r'my-subscription', SubscriptionViewSet, basename='my-subscription')

urlpatterns = [
    path('', include(router.urls)),
]
