from rest_framework import status, views, response
from rest_framework.permissions import IsAuthenticated
from .models import PrayerSettings, AdhanAlarm, UserPreferences
from .services import PrayerTimeService
from .serializers import PrayerSettingsSerializer, AdhanAlarmSerializer, PrayerTimesResponseSerializer, UserPreferencesSerializer
import asyncio
from asgiref.sync import async_to_sync

class PrayerTimesView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Try to get from user settings
        settings = PrayerSettings.objects.filter(user=request.user).first()
        if not settings:
            # Return default or error
            return response.Response({"error": "Location not set"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch prayer times
        # Since service is async, we use async_to_sync if we are in a sync view
        times = async_to_sync(PrayerTimeService.get_prayer_times)(
            lat=settings.location_lat, 
            lng=settings.location_lng, 
            method=settings.calculation_method
        )
        
        if times:
            return response.Response(times)
        return response.Response({"error": "Failed to fetch timings"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PrayerLocationView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings = PrayerSettings.objects.filter(user=request.user).first()
        if settings:
            serializer = PrayerSettingsSerializer(settings)
            return response.Response(serializer.data)
        return response.Response(None, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PrayerSettingsSerializer(data=request.data)
        if serializer.is_valid():
            # Update or create
            settings, created = PrayerSettings.objects.update_or_create(
                user=request.user,
                defaults=serializer.validated_data
            )
            return response.Response(PrayerSettingsSerializer(settings).data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlarmsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        alarms = AdhanAlarm.objects.filter(user=request.user)
        serializer = AdhanAlarmSerializer(alarms, many=True)
        return response.Response(serializer.data)

class AlarmsToggleView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prayer_name = request.data.get('prayer_name')
        if not prayer_name:
            return response.Response({"error": "prayer_name required"}, status=status.HTTP_400_BAD_REQUEST)
        
        alarm = AdhanAlarm.objects.filter(user=request.user, prayer_name=prayer_name).first()
        if not alarm:
            # Create a default enabled alarm
            alarm = AdhanAlarm.objects.create(user=request.user, prayer_name=prayer_name, enabled=True)
        else:
            alarm.enabled = not alarm.enabled
            alarm.save()
            
        return response.Response({"prayer_name": prayer_name, "enabled": alarm.enabled})

class PreferencesView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        prefs, created = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesSerializer(prefs)
        return response.Response(serializer.data)

class PreferencesUpdateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prefs, created = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesSerializer(prefs, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

