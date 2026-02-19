from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SubscriptionTier, Subscription
from .serializers import SubscriptionTierSerializer, SubscriptionSerializer
from django.utils import timezone

class SubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        tier_id = request.data.get('tier_id')
        try:
            tier = SubscriptionTier.objects.get(id=tier_id)
            # Logic for Stripe would go here
            # For now, we mock the subscription
            subscription, created = Subscription.objects.update_or_create(
                user=request.user,
                defaults={
                    'tier': tier,
                    'status': 'active',
                    'current_period_end': timezone.now() + timezone.timedelta(days=30)
                }
            )
            return Response({'status': 'success', 'message': f'Subscribed to {tier.name}'})
        except SubscriptionTier.DoesNotExist:
            return Response({'error': 'Invalid tier'}, status=status.HTTP_400_BAD_REQUEST)

class SubscriptionTierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionTier.objects.filter(is_active=True)
    serializer_class = SubscriptionTierSerializer
