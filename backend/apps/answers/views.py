from rest_framework import viewsets, permissions, serializers
from .models import DraftAnswer, Answer, SavedAnswer
from .serializers import DraftAnswerSerializer, AnswerSerializer

class SavedAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedAnswer
        fields = '__all__'
        read_only_fields = ('user',)

class DraftAnswerViewSet(viewsets.ModelViewSet):
    # ... (existing code but simplified for brevity in this tool call)
    queryset = DraftAnswer.objects.all().order_by('-created_at')
    serializer_class = DraftAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Answer.objects.all().order_by('-created_at')
        question_id = self.request.query_params.get('question')
        if question_id:
            queryset = queryset.filter(question_id=question_id)
        return queryset

class SavedAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = SavedAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedAnswer.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
