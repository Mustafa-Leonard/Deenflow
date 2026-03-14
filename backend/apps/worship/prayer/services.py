import httpx
from django.core.cache import cache
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

METHOD_CODES = {
    'ISNA': 2, 'MWL': 3, 'Makkah': 4, 'Egypt': 5, 'Tehran': 7,
    'Gulf': 8, 'Kuwait': 9, 'Qatar': 10, 'Singapore': 11,
    'France': 12, 'Turkey': 13, 'Russia': 14, 'Hanafi': 1, 'Shafi': 0,
}

class PrayerTimeService:
    @staticmethod
    async def get_prayer_times(lat, lng, method=2, date=None):
        """
        Fetch prayer times from Aladhan API or local calculation.
        Using Aladhan API with caching for performance.
        """
        if not date:
            date = datetime.now().strftime('%d-%m-%Y')

        # Convert string method name to integer code for API
        if isinstance(method, str) and method in METHOD_CODES:
            method_code = METHOD_CODES[method]
        else:
            try:
                method_code = int(method)
            except (ValueError, TypeError):
                method_code = 2

        cache_key = f"prayer_times_{lat}_{lng}_{date}_{method_code}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        url = f"https://api.aladhan.com/v1/timings/{date}?latitude={lat}&longitude={lng}&method={method_code}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json().get('data', {}).get('timings', {})
                    # Cache for 24 hours as timings change daily
                    cache.set(cache_key, data, timeout=86400)
                    return data
                else:
                    logger.error(f"Aladhan API returned {response.status_code}")
            except Exception as e:
                logger.error(f"Error fetching prayer times: {e}")
        
        return None
