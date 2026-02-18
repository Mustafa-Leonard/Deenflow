import os
import django
import json
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from quran.views import SurahListView, JuzDetailView

def test_surah_list():
    factory = APIRequestFactory()
    user = get_user_model().objects.first()
    view = SurahListView.as_view()
    request = factory.get('/api/quran/surahs/')
    force_authenticate(request, user=user)
    response = view(request)
    print("Surah List Data Type:", type(response.data))
    print("Surah List Count:", len(response.data) if isinstance(response.data, list) else "N/A")
    if isinstance(response.data, list) and len(response.data) > 0:
        print("First Surah Sample:", json.dumps(response.data[0], indent=2))

def test_juz_detail():
    factory = APIRequestFactory()
    user = get_user_model().objects.first()
    view = JuzDetailView.as_view()
    request = factory.get('/api/quran/juz/1/')
    force_authenticate(request, user=user)
    response = view(request, number=1)
    print("\nJuz Detail Data Keys:", response.data.keys() if isinstance(response.data, dict) else "N/A")
    if 'ayahs' in response.data:
        print("Ayahs count in Juz 1:", len(response.data['ayahs']))

if __name__ == "__main__":
    test_surah_list()
    test_juz_detail()
