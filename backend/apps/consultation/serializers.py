from rest_framework import serializers
from .models import Scholar, Specialization, ConsultationSession

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'

class ScholarSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    class Meta:
        model = Scholar
        fields = ['id', 'user', 'full_name', 'bio', 'is_verified', 'rating', 'specializations', 'hourly_rate']

class ConsultationSessionSerializer(serializers.ModelSerializer):
    scholar_name = serializers.CharField(source='scholar.user.full_name', read_only=True)
    class Meta:
        model = ConsultationSession
        fields = '__all__'
        read_only_fields = ['status', 'member']
