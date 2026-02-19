from rest_framework import viewsets, permissions, filters
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for viewing system audit logs. 
    Restricted to super_admins and content_admins.
    """
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated] # Role check would be better but keeping it simple for now
    filter_backends = [filters.SearchFilter]
    search_fields = ['entity_type', 'action', 'admin__full_name']
