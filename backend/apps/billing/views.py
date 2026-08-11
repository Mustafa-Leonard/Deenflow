from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SubscriptionTier, Subscription
from .serializers import SubscriptionTierSerializer, SubscriptionSerializer
from django.utils import timezone

class SubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def initial(self, request, *args, **kwargs):
        from django.conf import settings
        if not getattr(settings, 'PAYMENTS_ENABLED', False):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Payments are currently disabled.")
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        tier_identifier = request.data.get('tier_id') or request.data.get('tier')
        if not tier_identifier:
            return Response({'error': 'tier_id or tier is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if str(tier_identifier).isdigit():
                tier = SubscriptionTier.objects.get(id=tier_identifier)
            else:
                tier = SubscriptionTier.objects.get(slug=tier_identifier)
                
            # Logic for Stripe would go here
            subscription, created = Subscription.objects.update_or_create(
                user=request.user,
                defaults={
                    'tier': tier,
                    'status': 'active',
                    'current_period_end': timezone.now() + timezone.timedelta(days=30)
                }
            )
            return Response({
                'status': 'success', 
                'message': f'Subscribed to {tier.name}',
                'tier': SubscriptionTierSerializer(tier).data
            })
        except SubscriptionTier.DoesNotExist:
            return Response({'error': f'Invalid tier: {tier_identifier}'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def mpesa_pay(self, request):
        """Initiate an M-Pesa STK Push for a subscription tier purchase."""
        from .services.mpesa import initiate_stk_push, is_configured

        if not is_configured():
            return Response(
                {'error': 'M-Pesa is not configured on the server. Please contact support.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        tier_identifier = request.data.get('tier_id') or request.data.get('tier')
        phone = request.data.get('phone')
        if not tier_identifier:
            return Response({'error': 'tier_id or tier is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not phone:
            return Response({'error': 'phone is required for M-Pesa payment'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if str(tier_identifier).isdigit():
                tier = SubscriptionTier.objects.get(id=tier_identifier)
            else:
                tier = SubscriptionTier.objects.get(slug=tier_identifier)
        except SubscriptionTier.DoesNotExist:
            return Response({'error': f'Invalid tier: {tier_identifier}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = initiate_stk_push(
                amount=float(tier.price_monthly),
                phone=phone,
                account_reference=f'DF-SUB-{request.user.id}',
                description=f'DeenFlow {tier.name} subscription'
            )
        except Exception as e:
            return Response({'error': f'M-Pesa request failed: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({
            'status': 'pending',
            'message': 'M-Pesa STK push sent. Confirm on your phone.',
            'checkout_request_id': result.get('checkout_request_id'),
            'merchant_request_id': result.get('merchant_request_id'),
            'amount': float(tier.price_monthly),
            'tier': SubscriptionTierSerializer(tier).data,
        })

class SubscriptionTierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionTier.objects.filter(is_active=True)
    serializer_class = SubscriptionTierSerializer
