import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test.client import RequestFactory
from questions.serializers import QuestionSerializer
from questions.models import Question

User = get_user_model()
member, _ = User.objects.get_or_create(username='serializer_member', defaults={'email':'serializer_member@example.com'})
member.set_password('memberpass')
member.save()

# Create admin
admin, _ = User.objects.get_or_create(username='serializer_admin', defaults={'email':'serializer_admin@example.com', 'is_staff': True})
admin.set_password('adminpass')
admin.is_staff = True
admin.save()

factory = RequestFactory()
# Build a dummy request that has .user
req = factory.post('/api/questions/')
req.user = member

data = {'text': 'Question created via serializer test'}
serializer = QuestionSerializer(data=data, context={'request': req})
if not serializer.is_valid():
    print('Serializer errors:', serializer.errors)
else:
    q = serializer.save()
    print('Created Question id:', q.id, 'user:', q.user.username)

# Verify admin can see the question via queryset
qs = Question.objects.all()
print('Questions count in DB:', qs.count())
print('First question user:', qs.first().user.username)
