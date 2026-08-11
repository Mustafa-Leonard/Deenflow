from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name')

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
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'theme', 'role', 'madhhab', 'is_admin', 'password')
        extra_kwargs = {
            'username': {'required': False},
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add profile data to the token response
        data['user'] = ProfileSerializer(self.user).data
        return data


class MyTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Get user from refresh token
        refresh = RefreshToken(attrs['refresh'])
        user_id = refresh.payload.get('user_id')
        user = User.objects.get(id=user_id)
        data['user'] = ProfileSerializer(user).data
        return data
