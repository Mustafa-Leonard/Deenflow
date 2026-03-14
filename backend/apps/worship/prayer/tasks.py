from celery import shared_task
from django.utils import timezone
from .models import AdhanAlarm, PrayerSettings
from .services import PrayerTimeService
from asgiref.sync import async_to_sync
import datetime
import logging

logger = logging.getLogger(__name__)

@shared_task
def check_prayer_alarms():
    """
    Periodic task to check if any user has a prayer alarm due.
    Should run every minute.
    """
    now = timezone.now()
    current_time_str = now.strftime('%H:%M')
    
    # In a real system, you'd fetch prayer times for each user's location.
    # To be efficient, we can fetch unique locations and their prayer times.
    unique_locations = PrayerSettings.objects.values('location_lat', 'location_lng', 'calculation_method').distinct()
    
    for loc in unique_locations:
        # Get prayer times for this location
        # Use sync wrapper for async service
        times = async_to_sync(PrayerTimeService.get_prayer_times)(
            lat=loc['location_lat'], 
            lng=loc['location_lng'], 
            method=loc['calculation_method']
        )
        
        if not times:
            continue
            
        for prayer_name, prayer_time in times.items():
            # Check if current time matches prayer time (roughly)
            if prayer_time == current_time_str:
                # Trigger alarms for all users at this location for this prayer
                users_at_loc = PrayerSettings.objects.filter(
                    location_lat=loc['location_lat'], 
                    location_lng=loc['location_lng']
                ).values_list('user_id', flat=True)
                
                active_alarms = AdhanAlarm.objects.filter(
                    user_id__in=users_at_loc, 
                    prayer_name=prayer_name, 
                    enabled=True
                )
                
                for alarm in active_alarms:
                    trigger_notification.delay(alarm.user_id, prayer_name)

@shared_task
def trigger_notification(user_id, prayer_name):
    # This would send a real notification, e.g. via Django Channels or Push
    logger.info(f"Triggering Adhan alarm for user {user_id} - Prayer {prayer_name}")
    print(f"ALARM: Adhan for {prayer_name} is now! User {user_id}")
