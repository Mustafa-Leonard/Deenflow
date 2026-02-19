from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WalletViewSet, CampaignViewSet, DonationViewSet

router = DefaultRouter()
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'my-donations', DonationViewSet, basename='my-donation')

urlpatterns = [
    path('', include(router.urls)),
]
