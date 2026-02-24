from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Wallet, Campaign, Donation, Transaction
from .serializers import WalletSerializer, CampaignSerializer, DonationSerializer, TransactionSerializer
from django.db import transaction

class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WalletSerializer

    def initial(self, request, *args, **kwargs):
        from django.conf import settings
        if not getattr(settings, 'PAYMENTS_ENABLED', False):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Payments are currently disabled.")
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def deposit(self, request):
        amount = request.data.get('amount')
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        wallet.balance += float(amount)
        wallet.save()
        Transaction.objects.create(wallet=wallet, amount=amount, transaction_type='deposit', status='completed')
        return Response({'status': 'success', 'balance': wallet.balance})

class CampaignViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Campaign.objects.filter(is_active=True)
    serializer_class = CampaignSerializer

class DonationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DonationSerializer

    def initial(self, request, *args, **kwargs):
        from django.conf import settings
        if not getattr(settings, 'PAYMENTS_ENABLED', False):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Payments are currently disabled.")
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        return Donation.objects.filter(user=self.request.user)

    @transaction.atomic
    def perform_create(self, serializer):
        campaign = serializer.validated_data['campaign']
        amount = serializer.validated_data['amount']
        wallet = Wallet.objects.get(user=self.request.user)
        
        if wallet.balance < amount:
            from rest_framework import serializers
            raise serializers.ValidationError({"error": "Insufficient balance in your Zakat/Sadaqah wallet."})
        
        wallet.balance -= amount
        wallet.save()
        
        campaign.current_amount += amount
        campaign.save()
        
        Transaction.objects.create(wallet=wallet, amount=amount, transaction_type='donation', status='completed')
        serializer.save(user=self.request.user)
