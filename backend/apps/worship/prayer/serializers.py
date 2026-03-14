from rest_framework import serializers
from .models import PrayerSettings, AdhanAlarm, UserPreferences

class PrayerSettingsSerializer(serializers.ModelSerializer):
    calculation_method = serializers.CharField(default='ISNA', required=False)
    location_lat = serializers.CharField()
    location_lng = serializers.CharField()

    class Meta:
        model = PrayerSettings
        fields = ['location_lat', 'location_lng', 'calculation_method', 'timezone']

    def validate_calculation_method(self, value):
        # Accept integer method codes and convert to string
        method_map = {
            '0': 'Shafi', '1': 'Hanafi', '2': 'ISNA', '3': 'MWL',
            '4': 'Makkah', '5': 'Egypt', '7': 'Tehran', '8': 'Gulf',
            '9': 'Kuwait', '10': 'Qatar', '11': 'Singapore', '12': 'France',
            '13': 'Turkey', '14': 'Russia',
        }
        if str(value) in method_map:
            return method_map[str(value)]
        return str(value) if value else 'ISNA'

    def validate_location_lat(self, value):
        from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
        try:
            return Decimal(str(value)).quantize(Decimal('0.000000'), rounding=ROUND_HALF_UP)
        except (InvalidOperation, TypeError):
            raise serializers.ValidationError("Invalid latitude format")

    def validate_location_lng(self, value):
        from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
        try:
            return Decimal(str(value)).quantize(Decimal('0.000000'), rounding=ROUND_HALF_UP)
        except (InvalidOperation, TypeError):
            raise serializers.ValidationError("Invalid longitude format")

class AdhanAlarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdhanAlarm
        fields = ['prayer_name', 'enabled', 'offset_minutes', 'tone']

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ['selected_reciter', 'translation_language', 'adhan_enabled']

class PrayerTimesResponseSerializer(serializers.Serializer):
    Fajr = serializers.CharField()
    Sunrise = serializers.CharField()
    Dhuhr = serializers.CharField()
    Asr = serializers.CharField()
    Sunset = serializers.CharField()
    Maghrib = serializers.CharField()
    Isha = serializers.CharField()
    Imsak = serializers.CharField()
    Midnight = serializers.CharField()
    Firstthird = serializers.CharField()
    Lastthird = serializers.CharField()
