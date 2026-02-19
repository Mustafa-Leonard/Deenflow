from rest_framework import viewsets, permissions
from .models import DailyStats
from rest_framework import serializers
from rest_framework.response import Response

class DailyStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStats
        fields = '__all__'

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    def list(self, request):
        stats = DailyStats.objects.all().order_by('-date')[:30]
        serializer = DailyStatsSerializer(stats, many=True)
        return Response(serializer.data)
