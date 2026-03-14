from django.core.management.base import BaseCommand
from worship.categories.models import WorshipCategory

class Command(BaseCommand):
    help = 'Seed worship categories'

    def handle(self, *args, **options):
        cats = [
            "Morning", "Evening", "Before Sleep", "After Waking", "After Salah", 
            "Tahajjud", "Travel", "Home Entry/Exit", "Eating/Drinking", "Illness", 
            "Difficulty", "Marriage", "Children", "Protection", "Hajj", "Umrah", 
            "Ramadan", "Istighfar", "Tasbih", "Names of Allah", "Quranic Duas"
        ]
        
        # Some should be Dhikr (Tasbih, Istighfar, Names of Allah) 
        # Most are Dua
        dhikr_names = ["Tasbih", "Istighfar", "Names of Allah", "Morning", "Evening"]
        
        for name in cats:
            type_val = 'dhikr' if name in dhikr_names else 'dua'
            WorshipCategory.objects.get_or_create(name=name, type=type_val)
            
        self.stdout.write(self.style.SUCCESS("Worship categories seeded successfully."))
