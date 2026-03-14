from django.core.management.base import BaseCommand
from worship.audio.models import Reciter

class Command(BaseCommand):
    help = 'Seed at least 3 reciters into the database'

    def handle(self, *args, **options):
        reciters_data = [
            {
                "name": "Mishary Rashid Al-Afasy",
                "audio_base_url": "https://server8.mp3quran.net/afs",
                "style": "Murattal",
                "is_active": True
            },
            {
                "name": "Abdul Rahman Al-Sudais",
                "audio_base_url": "https://server11.mp3quran.net/sds",
                "style": "Murattal",
                "is_active": True
            },
            {
                "name": "Maher Al-Muaiqly",
                "audio_base_url": "https://server12.mp3quran.net/maher",
                "style": "Murattal",
                "is_active": True
            }
        ]

        for r_data in reciters_data:
            reciter, created = Reciter.objects.update_or_create(
                name=r_data['name'],
                defaults=r_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Reciter '{reciter.name}' created."))
            else:
                self.stdout.write(self.style.NOTICE(f"Reciter '{reciter.name}' already exists."))
