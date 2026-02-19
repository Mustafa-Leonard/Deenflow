from rest_framework import serializers
from .models import FiqhRuling

class FiqhRulingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiqhRuling
        fields = '__all__'
