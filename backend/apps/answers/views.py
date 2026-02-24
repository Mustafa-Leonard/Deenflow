from rest_framework import viewsets, permissions, serializers
from .models import DraftAnswer, Answer, SavedAnswer
from .serializers import DraftAnswerSerializer, AnswerSerializer

class SavedAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedAnswer
        fields = '__all__'
        read_only_fields = ('user',)

from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AnswerSource

class DraftAnswerViewSet(viewsets.ModelViewSet):
    queryset = DraftAnswer.objects.all().order_by('-created_at')
    serializer_class = DraftAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        draft = self.get_object()
        # Create final answer
        answer = Answer.objects.create(
            question=draft.question,
            text=draft.ai_text,
            published_by=request.user
        )
        # Copy sources
        for ruling in draft.used_rulings.all():
            AnswerSource.objects.create(answer=answer, fiqh_ruling=ruling)
        
        draft.status = 'approved'
        draft.save()
        
        draft.question.status = 'answered'
        draft.question.save()
        
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        draft = self.get_object()
        draft.status = 'rejected'
        draft.save()
        return Response({'status': 'rejected'})


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
