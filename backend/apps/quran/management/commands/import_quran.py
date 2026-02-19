import requests
from django.core.management.base import BaseCommand
from django.db import transaction
from quran.models import Surah, Juz, Ayah

class Command(BaseCommand):
    help = 'Imports the entire Quran from AlQuran.cloud API'

    def handle(self, *args, **options):
        self.stdout.write("Connecting to api.alquran.cloud...")
        
        # 1. Setup Juz (1-30)
        for i in range(1, 31):
            Juz.objects.get_or_create(number=i)

        try:
            # 2. Fetch Editions (Uthmani, English translation, and Alafasy audio)
            self.stdout.write("Fetching Arabic text, English translation, and Audio URLs...")
            
            arabic_res = requests.get("https://api.alquran.cloud/v1/quran/quran-uthmani").json()
            english_res = requests.get("https://api.alquran.cloud/v1/quran/en.sahih").json()
            audio_res = requests.get("https://api.alquran.cloud/v1/quran/ar.alafasy").json()

            if arabic_res['code'] != 200 or english_res['code'] != 200 or audio_res['code'] != 200:
                raise Exception("API error")

            surahs_data = arabic_res['data']['surahs']
            english_data = english_res['data']['surahs']
            audio_data = audio_res['data']['surahs']

            with transaction.atomic():
                for idx, s_data in enumerate(surahs_data):
                    e_surah = english_data[idx]
                    a_surah = audio_data[idx]
                    
                    self.stdout.write(f"Importing Surah {s_data['number']}: {s_data['englishName']}...")
                    
                    surah, _ = Surah.objects.update_or_create(
                        number=s_data['number'],
                        defaults={
                            'name_arabic': s_data['name'],
                            'name_english': s_data['englishName'],
                            'revelation_place': s_data['revelationType'],
                            'total_ayahs': len(s_data['ayahs'])
                        }
                    )

                    for a_idx, ayah_data in enumerate(s_data['ayahs']):
                        translation_text = e_surah['ayahs'][a_idx]['text']
                        audio_url = a_surah['ayahs'][a_idx]['audio']
                        juz_obj = Juz.objects.get(number=ayah_data['juz'])

                        Ayah.objects.update_or_create(
                            ayah_number_global=ayah_data['number'],
                            defaults={
                                'surah': surah,
                                'juz': juz_obj,
                                'ayah_number_in_surah': ayah_data['numberInSurah'],
                                'text_arabic': ayah_data['text'],
                                'text_translation_en': translation_text,
                                'audio_url': audio_url
                            }
                        )

            self.stdout.write(self.style.SUCCESS("Full Quran import completed successfully."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Import failed: {str(e)}"))
