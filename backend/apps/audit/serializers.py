from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    admin_name = serializers.ReadOnlyField(source='admin.full_name')
    
    class Meta:
        model = AuditLog
        fields = '__all__'
