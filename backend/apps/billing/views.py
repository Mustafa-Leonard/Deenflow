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

class SubscriptionTierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionTier.objects.filter(is_active=True)
    serializer_class = SubscriptionTierSerializer
