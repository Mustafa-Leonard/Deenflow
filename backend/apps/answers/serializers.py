from rest_framework import serializers
from .models import DraftAnswer, Answer, AnswerSource
from fiqh.serializers import FiqhRulingSerializer

class DraftAnswerSerializer(serializers.ModelSerializer):
    used_rulings_data = FiqhRulingSerializer(source='used_rulings', many=True, read_only=True)
    
    class Meta:
        model = DraftAnswer
        fields = '__all__'

class AnswerSourceSerializer(serializers.ModelSerializer):
    title = serializers.ReadOnlyField(source='fiqh_ruling.title')
    
    class Meta:
        model = AnswerSource
        fields = ['id', 'fiqh_ruling', 'title']

class AnswerSerializer(serializers.ModelSerializer):
    sources = AnswerSourceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Answer
        fields = '__all__'
