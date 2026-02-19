from rest_framework import viewsets, permissions
from .models import Flag
from rest_framework import serializers

class FlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flag
        fields = '__all__'

class FlagViewSet(viewsets.ModelViewSet):
    queryset = Flag.objects.all().order_by('-created_at')
    serializer_class = FlagSerializer
    permission_classes = [permissions.IsAuthenticated]
