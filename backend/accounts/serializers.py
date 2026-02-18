from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    username = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id','username','email','full_name','password')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists')
        return value

    def validate_username(self, value):
        if value and User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('Username already taken')
        return value

    def create(self, validated_data):
        email = validated_data.get('email')
        username = validated_data.get('username') or email
        full_name = validated_data.get('full_name', '')
        password = validated_data.get('password')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            full_name=full_name
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    is_admin = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ('id','username','email','full_name','theme','is_admin')
