from rest_framework import serializers
from .models import SubscriptionTier, Subscription

class SubscriptionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionTier
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    tier_name = serializers.CharField(source='tier.name', read_only=True)
    class Meta:
        model = Subscription
        fields = ['id', 'tier', 'tier_name', 'status', 'current_period_end', 'cancel_at_period_end']
        read_only_fields = ['status', 'current_period_end']
