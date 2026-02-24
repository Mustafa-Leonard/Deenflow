from rest_framework import serializers
from .models import Question


class QuestionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ['status', 'detected_topics']
