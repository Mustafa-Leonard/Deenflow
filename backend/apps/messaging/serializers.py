from rest_framework import serializers
from .models import Thread, Message
from accounts.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'thread', 'sender', 'sender_name', 'content', 'attachments', 'created_at', 'is_read', 'is_me']
        read_only_fields = ['sender', 'created_at']

    def get_is_me(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.sender == request.user
        return False

class ThreadSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    participants_details = UserSerializer(source='participants', many=True, read_only=True)

    class Meta:
        model = Thread
        fields = ['id', 'subject', 'participants', 'participants_details', 'created_at', 'updated_at', 'last_message']

    def get_last_message(self, obj):
        msg = obj.messages.last()
        if msg:
            return MessageSerializer(msg, context=self.context).data
        return None
