from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from .models import GuidanceRequest, SavedReflection
from .serializers import GuidanceRequestSerializer, GuidanceRequestDetailSerializer, SavedReflectionSerializer
from .services import call_ai_for_guidance

class GuidanceCreateView(generics.CreateAPIView):
    serializer_class = GuidanceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def create(self, request, *args, **kwargs):
        input_text = request.data.get('input_text','').strip()
        if not input_text:
            return Response({'detail':'input_text required'}, status=status.HTTP_400_BAD_REQUEST)
        gr = GuidanceRequest.objects.create(user=request.user, input_text=input_text)
        try:
            ai_json = call_ai_for_guidance(input_text)
            gr.response_json = ai_json
            gr.category = ai_json.get('category','')
            gr.status = 'done'
            gr.save()
        except Exception as e:
            gr.status = 'failed'
            gr.save()
            return Response({'detail':'AI processing failed','error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = GuidanceRequestDetailSerializer(gr)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GuidanceHistoryView(generics.ListAPIView):
    serializer_class = GuidanceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GuidanceRequest.objects.filter(user=self.request.user).order_by('-created_at')

class GuidanceDetailView(generics.RetrieveAPIView):
    serializer_class = GuidanceRequestDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = GuidanceRequest.objects.all()

class SavedReflectionCreateView(generics.CreateAPIView):
    serializer_class = SavedReflectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedReflectionListView(generics.ListAPIView):
    serializer_class = SavedReflectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedReflection.objects.filter(user=self.request.user).order_by('-created_at')

class SavedReflectionDeleteView(generics.DestroyAPIView):
    serializer_class = SavedReflectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedReflection.objects.filter(user=self.request.user)
