from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AnswerReview, ReviewChecklist
from answers.models import DraftAnswer, Answer, AnswerSource
from audit.services import AuditService

class ModerationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        draft = DraftAnswer.objects.get(id=pk)
        data = request.data
        checklist_data = data.get('checklist', {})
        notes = data.get('notes', '')

        # 1. Create Review & Checklist
        review = AnswerReview.objects.create(
            draft_answer=draft,
            reviewer=request.user,
            decision='approve',
            notes=notes
        )
        ReviewChecklist.objects.create(
            review=review,
            **checklist_data
        )

        # 2. Publish Answer
        answer = Answer.objects.create(
            question=draft.question,
            text=draft.ai_text,
            published_by=request.user
        )

        # 3. Link Sources
        for ruling in draft.used_rulings.all():
            AnswerSource.objects.create(answer=answer, fiqh_ruling=ruling)

        # 4. Update Statuses
        draft.status = 'approved'
        draft.save()
        draft.question.status = 'answered'
        draft.question.save()

        # 5. Audit Log
        AuditService.log_action(
            admin=request.user,
            entity_type='Answer',
            entity_id=answer.id,
            action='approve',
            new_data={'answer_id': answer.id, 'review_id': review.id}
        )

        return Response({'status': 'published', 'answer_id': answer.id})
