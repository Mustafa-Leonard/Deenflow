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

    @action(detail=False, methods=['post'])
    def mpesa_deposit(self, request):
        """Initiate an M-Pesa STK Push to credit the user's wallet."""
        from billing.services.mpesa import initiate_stk_push, is_configured

        if not is_configured():
            return Response(
                {'error': 'M-Pesa is not configured on the server. Please contact support.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        amount = request.data.get('amount')
        phone = request.data.get('phone')
        if not amount:
            return Response({'error': 'amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not phone:
            return Response({'error': 'phone is required for M-Pesa payment'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except (TypeError, ValueError):
            return Response({'error': 'amount must be a positive number'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = initiate_stk_push(
                amount=amount,
                phone=phone,
                account_reference=f'DF-WAL-{request.user.id}',
                description='DeenFlow wallet top-up'
            )
        except Exception as e:
            return Response({'error': f'M-Pesa request failed: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({
            'status': 'pending',
            'message': 'M-Pesa STK push sent. Confirm on your phone.',
            'checkout_request_id': result.get('checkout_request_id'),
            'merchant_request_id': result.get('merchant_request_id'),
            'amount': amount,
        })

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
