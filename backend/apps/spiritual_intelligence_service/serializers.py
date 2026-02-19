from rest_framework import serializers
from .models import UserDeenPlan, GoalTarget, Ruling, Evidence, Madhhab

class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = '__all__'

class RulingSerializer(serializers.ModelSerializer):
    evidence = EvidenceSerializer(many=True, read_only=True)
    class Meta:
        model = Ruling
        fields = '__all__'

class GoalTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalTarget
        fields = '__all__'

class DeenPlanSerializer(serializers.ModelSerializer):
    targets = GoalTargetSerializer(many=True, read_only=True)
    class Meta:
        model = UserDeenPlan
        fields = '__all__'
