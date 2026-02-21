from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import LearningPath, Lesson, UserProgress
from .serializers import LearningPathSerializer, LessonSerializer

class LearningPathListView(generics.ListAPIView):
    queryset = LearningPath.objects.filter(is_published=True)
    serializer_class = LearningPathSerializer
    permission_classes = [permissions.IsAuthenticated]

class LearningPathDetailView(generics.RetrieveAPIView):
    queryset = LearningPath.objects.filter(is_published=True)
    serializer_class = LearningPathSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if obj.path.is_premium:
            user = self.request.user
            # Check if user has premium subscription or is staff/admin
            has_premium = hasattr(user, 'subscription') and user.subscription.status == 'active' and user.subscription.tier.slug in ['premium', 'pro']
            if not (has_premium or user.is_staff or user.is_superuser):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Premium subscription required to access this lesson.")
        return obj

class MarkLessonCompleteView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, lesson_id):
        UserProgress.objects.update_or_create(
            user=request.user,
            lesson_id=lesson_id
        )
        return Response({'success': True})
