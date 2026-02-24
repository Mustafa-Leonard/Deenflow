from rest_framework import viewsets, permissions
from .models import Question
from .serializers import QuestionSerializer
from ai_engine.tasks import process_new_question_task

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role != 'member':
            return Question.objects.all().order_by('-created_at')
        return Question.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        question = serializer.save()
        # Trigger async pipeline
        process_new_question_task.delay(question.id)
