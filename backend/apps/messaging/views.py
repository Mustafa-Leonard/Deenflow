from rest_framework import views, response, status, generics, permissions
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Thread, Message
from .serializers import ThreadSerializer, MessageSerializer

User = get_user_model()


class ThreadListView(views.APIView):
    """List all threads for the current user, or create a new one."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        threads = Thread.objects.filter(participants=request.user, is_active=True)
        serializer = ThreadSerializer(threads, many=True, context={'request': request})
        return response.Response(serializer.data)

    def post(self, request):
        """Create a thread. Admins/scholars can pass participant_id to start with a specific member."""
        subject = request.data.get('subject', '')
        participant_id = request.data.get('participant_id')

        thread = Thread.objects.create(subject=subject)
        thread.participants.add(request.user)

        if participant_id:
            try:
                other_user = User.objects.get(id=participant_id)
                thread.participants.add(other_user)
            except User.DoesNotExist:
                pass

        serializer = ThreadSerializer(thread, context={'request': request})
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)


class ThreadDetailView(views.APIView):
    """Get all messages in a thread."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, thread_id):
        try:
            thread = Thread.objects.get(id=thread_id, participants=request.user)
        except Thread.DoesNotExist:
            return response.Response({'error': 'Thread not found'}, status=status.HTTP_404_NOT_FOUND)

        # Mark all messages from other users as read
        Message.objects.filter(thread=thread, is_read=False).exclude(sender=request.user).update(is_read=True)

        messages = thread.messages.all()
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return response.Response({
            'thread': ThreadSerializer(thread, context={'request': request}).data,
            'messages': serializer.data
        })


class SendMessageView(views.APIView):
    """Send a message in a thread."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, thread_id):
        try:
            thread = Thread.objects.get(id=thread_id, participants=request.user)
        except Thread.DoesNotExist:
            return response.Response({'error': 'Thread not found'}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content', '').strip()
        if not content:
            return response.Response({'error': 'Message content required'}, status=status.HTTP_400_BAD_REQUEST)

        msg = Message.objects.create(
            thread=thread,
            sender=request.user,
            content=content,
        )
        # bump thread updated_at
        thread.save()

        serializer = MessageSerializer(msg, context={'request': request})
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminUsersForMessagingView(views.APIView):
    """Admin-only: list all members to message."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        
        search = request.GET.get('search', '')
        users = User.objects.filter(is_active=True).exclude(id=request.user.id)
        
        if search:
            users = users.filter(
                Q(username__icontains=search) | 
                Q(full_name__icontains=search) | 
                Q(email__icontains=search)
            )
            
        data = [{'id': str(u.id), 'name': u.full_name or u.username, 'email': u.email} for u in users[:50]]
        return response.Response(data)


class UnreadCountView(views.APIView):
    """How many unread messages the current user has."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(
            thread__participants=request.user,
            is_read=False
        ).exclude(sender=request.user).count()
        return response.Response({'unread': count})
