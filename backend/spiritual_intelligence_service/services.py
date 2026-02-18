from .models import Ruling, ExceptionRule, Condition

class FiqhEngine:
    def __init__(self, user_context):
        """
        user_context: {
            'madhhab': 'shafi',
            'is_traveling': False,
            'is_sick': False,
            'gender': 'male',
            ...
        }
        """
        self.context = user_context

    def get_applicable_ruling(self, ruling_title):
        try:
            ruling = Ruling.objects.get(
                title__iexact=ruling_title, 
                madhhab__name__iexact=self.context.get('madhhab', 'shafi')
            )
            
            result = {
                'title': ruling.title,
                'verdict': ruling.verdict,
                'summary': ruling.summary,
                'evidence': [
                    {'source': e.get_source_type_display(), 'ref': e.reference, 'text': e.text_english}
                    for e in ruling.evidence.all()
                ],
                'conditions': list(ruling.conditions.values_list('text', flat=True)),
                'modifications': []
            }

            # Evaluate Exceptions (Travel, Illness, etc.)
            if self.context.get('is_traveling'):
                exc = ruling.exceptions.filter(scenario__icontains='travel').first()
                if exc:
                    result['modifications'].append(exc.modification)
            
            if self.context.get('is_sick'):
                exc = ruling.exceptions.filter(scenario__icontains='sick').first()
                if exc:
                    result['modifications'].append(exc.modification)

            return result
        except Ruling.DoesNotExist:
            return None

    def explain_with_ai(self, ruling_id, additional_query=""):
        # This is where the AI is allowed to explain — but only within the bounds of the ruling
        ruling = Ruling.objects.get(id=ruling_id)
        # Call AI service with ruling.ai_explanation_prompt and ruling.summary
        # Placeholder for AI logic
        return f"AI Explanation based on {ruling.madhhab.name} school: {ruling.summary}"
