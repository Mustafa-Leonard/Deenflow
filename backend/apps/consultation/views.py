from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Scholar, ConsultationSession
from .serializers import ScholarSerializer, ConsultationSessionSerializer

class ScholarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Scholar.objects.filter(is_verified=True)
    serializer_class = ScholarSerializer

class ConsultationSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConsultationSessionSerializer

    def initial(self, request, *args, **kwargs):
        from django.conf import settings
        if not getattr(settings, 'PAYMENTS_ENABLED', False):
            if request.method == 'POST':
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Booking consultations is currently disabled.")
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'scholar_profile'):
            return ConsultationSession.objects.filter(scholar=user.scholar_profile)
        return ConsultationSession.objects.filter(member=user)

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)
