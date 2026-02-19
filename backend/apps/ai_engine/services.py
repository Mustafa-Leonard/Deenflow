import random
from fiqh.models import FiqhRuling
from questions.models import Question
from answers.models import DraftAnswer

class AIEngineService:
    @staticmethod
    def classify_question(question_id):
        question = Question.objects.get(id=question_id)
        # Mocking classification
        topics = ["finance", "riba"] if "interest" in question.text.lower() or "bank" in question.text.lower() else ["general"]
        question.detected_topics = topics
        question.status = 'processing'
        question.save()
        return topics

    @staticmethod
    def retrieve_rulings(topics):
        # Retrieve verified rulings matching topics or tags
        return FiqhRuling.objects.filter(
            verification_status='verified',
            topic__in=topics
        )

    @staticmethod
    def build_prompt(question_text, rulings):
        context = "\n".join([f"Ruling: {r.ruling_text}\nSources: {r.scholar}" for r in rulings])
        prompt = f"Using ONLY the following verified Islamic rulings, answer this question: {question_text}\n\nContext:\n{context}"
        return prompt

    @staticmethod
    def generate_draft(question_id):
        topics = AIEngineService.classify_question(question_id)
        rulings = AIEngineService.retrieve_rulings(topics)
        question = Question.objects.get(id=question_id)
        
        if not rulings.exists():
            question.status = 'needs_review'
            question.save()
            return None
            
        prompt = AIEngineService.build_prompt(question.text, rulings)
        # Mocking AI generation
        ai_text = f"Based on verified rulings regarding {', '.join(topics)}, interest is restricted... [Derived from {len(rulings)} source(s)]"
        
        draft = DraftAnswer.objects.create(
            question=question,
            ai_text=ai_text,
            status='draft'
        )
        draft.used_rulings.set(rulings)
        
        question.status = 'needs_review'
        question.save()
        return draft
