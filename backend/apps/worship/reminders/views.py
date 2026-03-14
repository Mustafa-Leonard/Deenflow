from rest_framework import views, response, status
from rest_framework.permissions import IsAuthenticated
from .models import WorshipReminder
from worship.categories.models import WorshipCategory

class ReminderListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reminders = WorshipReminder.objects.filter(user=request.user)
        data = [{
            "id": r.id,
            "title": r.title,
            "category": r.category.name if r.category else None,
            "scheduled_time": r.scheduled_time.strftime('%H:%M'),
            "repeat_rule": r.repeat_rule
        } for r in reminders]
        return response.Response(data)

    def post(self, request):
        category_id = request.data.get('category_id')
        scheduled_time = request.data.get('scheduled_time')
        repeat_rule = request.data.get('repeat_rule', 'daily')
        title = request.data.get('title', '')
        
        if not scheduled_time:
            return response.Response({"error": "scheduled_time required"}, status=status.HTTP_400_BAD_REQUEST)
        
        category = WorshipCategory.objects.filter(id=category_id).first() if category_id else None
        
        reminder = WorshipReminder.objects.create(
            user=request.user,
            category=category,
            scheduled_time=scheduled_time,
            repeat_rule=repeat_rule,
            title=title
        )
        
        return response.Response({"id": reminder.id, "status": "created"})
