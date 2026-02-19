from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import FiqhRuling
from .serializers import FiqhRulingSerializer

class IsFiqhReviewerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (
            request.user.role in ['super_admin', 'fiqh_reviewer'] or request.user.is_superuser
        )

class FiqhRulingViewSet(viewsets.ModelViewSet):
    queryset = FiqhRuling.objects.all().order_by('-created_at')
    serializer_class = FiqhRulingSerializer
    permission_classes = [IsFiqhReviewerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['topic', 'verification_status', 'fiqh_school']
    search_fields = ['title', 'description', 'ruling_text', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        from audit.services import AuditService
        AuditService.log_action(
            admin=self.request.user,
            entity_type='FiqhRuling',
            entity_id=instance.id,
            action='create',
            new_data=serializer.data,
            request=self.request
        )
