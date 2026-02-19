from celery import shared_task
from .services import AIEngineService

@shared_task
def process_new_question_task(question_id):
    """
    Background task to classify a question, retrieve rulings, 
    and generate an AI draft answer.
    """
    return AIEngineService.generate_draft(question_id)
