import logging
from rest_framework import viewsets, permissions
from .models import Question
from .serializers import QuestionSerializer
from ai_engine.tasks import process_new_question_task

logger = logging.getLogger(__name__)

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
        self._dispatch_ai_task(question)

    def _dispatch_ai_task(self, question):
        """
        Dispatch the AI processing pipeline for a question.

        Prefers the async Celery path when a broker is available. If the
        broker is unavailable (e.g. Redis is down, or not configured in a
        lightweight/dev environment), it falls back to running the task
        synchronously so the user's question is never silently dropped.
        """
        try:
            process_new_question_task.delay(question.id)
        except Exception as exc:
            logger.warning(
                "Celery broker unavailable (%s); running AI pipeline synchronously "
                "for question %s.",
                exc, question.id,
            )
            try:
                process_new_question_task.run(question.id)
            except Exception as inner_exc:
                logger.error(
                    "Synchronous AI pipeline failed for question %s: %s",
                    question.id, inner_exc,
                )
                # Mark the question so it can be retried/processed later.
                try:
                    question.status = 'needs_review'
                    question.save(update_fields=['status'])
                except Exception:
                    pass
