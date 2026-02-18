from rest_framework import serializers
from .models import GuidanceRequest, SavedReflection

class GuidanceRequestSerializer(serializers.ModelSerializer):
    ai_response = serializers.SerializerMethodField()

    class Meta:
        model = GuidanceRequest
        fields = ('id','user','input_text','category','response_json','status','flagged','reviewed','flag_reason','created_at','ai_response')
        read_only_fields = ('id','user','category','response_json','status','created_at')

    def get_ai_response(self, obj):
        if obj.response_json and 'reflections' in obj.response_json:
            ref = obj.response_json['reflections']
            if isinstance(ref, list) and len(ref) > 0:
                return ref[0]
        return None

class GuidanceRequestDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuidanceRequest
        fields = '__all__'

class SavedReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedReflection
        fields = ('id','user','guidance','text','created_at')
        read_only_fields = ('id','user','created_at')
