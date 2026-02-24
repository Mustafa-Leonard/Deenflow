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

from .models import LearningPath, Lesson, UserProgress, Quiz, Question

class SubmitQuizView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)
            
        answers = request.data.get('answers', {})
        score = 0.0
        
        # If the lesson has a quiz, calculate the score
        if hasattr(lesson, 'quiz'):
            quiz = lesson.quiz
            questions = quiz.questions.all()
            total_questions = questions.count()
            
            if total_questions > 0:
                correct_count = 0
                for q in questions:
                    selected_option = answers.get(str(q.id))
                    if selected_option is not None and int(selected_option) == q.correct_option_index:
                        correct_count += 1
                score = (correct_count / total_questions) * 100
            else:
                score = 100.0 # No questions means automatic pass
        else:
            score = 100.0 # No quiz means automatic pass when marking complete
            
        UserProgress.objects.update_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'score': score}
        )
        
        return Response({
            'success': True,
            'score': score
        })

