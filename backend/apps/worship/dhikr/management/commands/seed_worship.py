from django.core.management.base import BaseCommand
from worship.dhikr.models import DhikrItem
from worship.duas.models import DuaItem
from worship.categories.models import WorshipCategory
from worship.asmaul_husna.models import AsmaulHusna

class Command(BaseCommand):
    help = 'Seed initial Dhikr, Duas, and Asmaul Husna data'

    def handle(self, *args, **options):
        # Ensure all categories are fetched/created
        categories_data = {
            "After Salah": WorshipCategory.objects.get_or_create(name="After Salah", defaults={"type": "dhikr"})[0],
            "Morning": WorshipCategory.objects.get_or_create(name="Morning", defaults={"type": "dhikr"})[0],
            "Evening": WorshipCategory.objects.get_or_create(name="Evening", defaults={"type": "dhikr"})[0],
            "Istighfar": WorshipCategory.objects.get_or_create(name="Istighfar", defaults={"type": "dhikr"})[0],
            "Tasbih": WorshipCategory.objects.get_or_create(name="Tasbih", defaults={"type": "dhikr"})[0],
            "Quranic Duas": WorshipCategory.objects.get_or_create(name="Quranic Duas", defaults={"type": "dua"})[0],
            "Travel": WorshipCategory.objects.get_or_create(name="Travel", defaults={"type": "dua"})[0],
            "Eating/Drinking": WorshipCategory.objects.get_or_create(name="Eating/Drinking", defaults={"type": "dua"})[0],
            "Before Sleep": WorshipCategory.objects.get_or_create(name="Before Sleep", defaults={"type": "dua"})[0],
            "After Waking": WorshipCategory.objects.get_or_create(name="After Waking", defaults={"type": "dua"})[0],
            "Difficulty": WorshipCategory.objects.get_or_create(name="Difficulty", defaults={"type": "dua"})[0],
            "Protection": WorshipCategory.objects.get_or_create(name="Protection", defaults={"type": "dua"})[0],
            "Home Entry/Exit": WorshipCategory.objects.get_or_create(name="Home Entry/Exit", defaults={"type": "dua"})[0],
            "Tahajjud": WorshipCategory.objects.get_or_create(name="Tahajjud", defaults={"type": "dua"})[0],
            "Illness": WorshipCategory.objects.get_or_create(name="Illness", defaults={"type": "dua"})[0],
            "Marriage": WorshipCategory.objects.get_or_create(name="Marriage", defaults={"type": "dua"})[0],
            "Children": WorshipCategory.objects.get_or_create(name="Children", defaults={"type": "dua"})[0],
            "Hajj": WorshipCategory.objects.get_or_create(name="Hajj", defaults={"type": "dua"})[0],
            "Umrah": WorshipCategory.objects.get_or_create(name="Umrah", defaults={"type": "dua"})[0],
            "Ramadan": WorshipCategory.objects.get_or_create(name="Ramadan", defaults={"type": "dua"})[0],
        }

        # Seed Dhikr
        dhikrs = [
            {
                "arabic_text": "سُبْحَانَ اللَّهِ",
                "translation": "Glory be to Allah",
                "transliteration": "Subhan Allah",
                "repeat_default": 33,
                "category": categories_data["After Salah"],
                "source_reference": "Sahih Muslim"
            },
            {
                "arabic_text": "الْحَمْدُ لِلَّهِ",
                "translation": "Praise be to Allah",
                "transliteration": "Alhamdulillah",
                "repeat_default": 33,
                "category": categories_data["After Salah"],
                "source_reference": "Sahih Muslim"
            },
            {
                "arabic_text": "اللَّهُ أَكْبَرُ",
                "translation": "Allah is the Greatest",
                "transliteration": "Allahu Akbar",
                "repeat_default": 34,
                "category": categories_data["After Salah"],
                "source_reference": "Sahih Muslim"
            },
            {
                "arabic_text": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
                "translation": "We have reached the morning and at this very time unto Allah belongs all sovereignty",
                "transliteration": "Asbahna wa asbahal mulku lillah",
                "repeat_default": 1,
                "category": categories_data["Morning"],
                "source_reference": "Hisn al-Muslim"
            },
            {
                "arabic_text": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
                "translation": "We have reached the evening and at this very time unto Allah belongs all sovereignty",
                "transliteration": "Amsayna wa amsyal mulku lillah",
                "repeat_default": 1,
                "category": categories_data["Evening"],
                "source_reference": "Hisn al-Muslim"
            },
            {
                "arabic_text": "أَسْتَغْفِرُ اللَّهَ",
                "translation": "I seek forgiveness from Allah",
                "transliteration": "Astaghfirullah",
                "repeat_default": 100,
                "category": categories_data["Istighfar"],
                "source_reference": "Sahih Bukhari"
            },
            {
                "arabic_text": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
                "translation": "Glory be to Allah and Praise is to Him",
                "transliteration": "Subhanallahi wa bihamdihi",
                "repeat_default": 100,
                "category": categories_data["Tasbih"],
                "source_reference": "Sahih Muslim"
            }
        ]

        for d_data in dhikrs:
            DhikrItem.objects.get_or_create(arabic_text=d_data['arabic_text'], category=d_data['category'], defaults=d_data)
        
        self.stdout.write(self.style.SUCCESS("Dhikr items seeded successfully."))

        # Seed Duas
        duas = [
            # Quranic Duas
            {
                "title": "Dua for Knowledge",
                "arabic_text": "رَّبِّ زِدْنِي عِلْمًا", 
                "translation": "My Lord, increase me in knowledge.", 
                "is_quranic": True,
                "verse_reference": "20:114",
                "category": categories_data["Quranic Duas"]
            },
            {
                "title": "Dua for Parents",
                "arabic_text": "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", 
                "translation": "My Lord, have mercy upon them as they brought me up [when I was] small.",
                "is_quranic": True,
                "verse_reference": "17:24",
                "category": categories_data["Quranic Duas"]
            },
            # Situation: Before Sleep
            {
                "title": "Before Sleeping",
                "arabic_text": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
                "translation": "In Your name, O Allah, I die and I live.",
                "is_quranic": False,
                "reference": "Sahih al-Bukhari",
                "category": categories_data["Before Sleep"]
            },
            # Situation: After Waking
            {
                "title": "After Waking up",
                "arabic_text": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
                "translation": "Praise is to Allah Who gives us life after He has caused us to die and to Him is the return.",
                "is_quranic": False,
                "reference": "Sahih al-Bukhari",
                "category": categories_data["After Waking"]
            },
            # Situation: Difficulty
            {
                "title": "When in Difficulty",
                "arabic_text": "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
                "translation": "O Ever Living One, O Self-Sustaining One, in Your Mercy do I seek relief.",
                "is_quranic": False,
                "reference": "At-Tirmidhi",
                "category": categories_data["Difficulty"]
            },
            # Situation: Home Entry
            {
                "title": "When Entering the Home",
                "arabic_text": "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
                "translation": "In the Name of Allah we enter, in the Name of Allah we leave, and upon our Lord we rely.",
                "is_quranic": False,
                "reference": "Abu Dawud",
                "category": categories_data["Home Entry/Exit"]
            },
            # Situation: Travel
            {
                "title": "Dua for Travel",
                "arabic_text": "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
                "translation": "Glory to Him who has brought this under our control, for we could not have done it ourselves",
                "is_quranic": False,
                "reference": "Hisn al-Muslim",
                "category": categories_data["Travel"]
            },
            # Situation: Eating
            {
                "title": "Before Eating",
                "arabic_text": "بِسْمِ اللَّهِ",
                "translation": "In the name of Allah",
                "is_quranic": False,
                "reference": "Sahih Muslim",
                "category": categories_data["Eating/Drinking"]
            },
            # Situation: Protection
            {
                "title": "Protection from Harm",
                "arabic_text": "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
                "translation": "In the Name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
                "is_quranic": False,
                "reference": "Hisn al-Muslim",
                "category": categories_data["Protection"]
            },
            # Situation: Tahajjud
            {
                "title": "Dua for Tahajjud",
                "arabic_text": "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالأَرْضِ",
                "translation": "O Allah, to You be all praise, You are the Light of the heavens and the earth.",
                "is_quranic": False,
                "reference": "Sahih al-Bukhari",
                "category": categories_data["Tahajjud"]
            },
            # Situation: Illness
            {
                "title": "Dua for the Sick",
                "arabic_text": "أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ، اشْفِ وَأَنْتَ الشَّافِي",
                "translation": "Remove the disease, O Lord of the people! Heal, for You are the Healer.",
                "is_quranic": False,
                "reference": "Sahih al-Bukhari",
                "category": categories_data["Illness"]
            },
            # Situation: Marriage
            {
                "title": "Dua for Newlyweds",
                "arabic_text": "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
                "translation": "May Allah bless you and shower His blessings upon you and join you both in goodness.",
                "is_quranic": False,
                "reference": "Abu Dawud",
                "category": categories_data["Marriage"]
            },
            # Situation: Children
            {
                "title": "Dua for Children",
                "arabic_text": "أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ",
                "translation": "I seek refuge for you in Allah's perfect words from every devil and every poisonous creature.",
                "is_quranic": False,
                "reference": "Sahih al-Bukhari",
                "category": categories_data["Children"]
            },
            # Situation: Hajj/Umrah
            {
                "title": "Talbiyah (Hajj/Umrah)",
                "arabic_text": "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ",
                "translation": "I am at Your service, O Allah, I am at Your service. You have no partner, I am at Your service.",
                "is_quranic": False,
                "reference": "Sahih Muslim",
                "category": categories_data["Hajj"]
            },
            # Situation: Ramadan
            {
                "title": "Dua for Breaking Fast (Iftar)",
                "arabic_text": "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
                "translation": "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
                "is_quranic": False,
                "reference": "Abu Dawud",
                "category": categories_data["Ramadan"]
            }
        ]

        for d_data in duas:
            DuaItem.objects.get_or_create(title=d_data['title'], category=d_data['category'], defaults=d_data)

        self.stdout.write(self.style.SUCCESS("Dua items seeded successfully."))

        # Seed Asmaul Husna (99 Names)
        names = [
            {"name_arabic": "اللّهُ", "transliteration": "Allah", "meaning": "God", "explanation": "The Name of the uniquely and properly worshipped One."},
            {"name_arabic": "الرَّحْمَنُ", "transliteration": "Ar-Rahman", "meaning": "The Most Merciful", "explanation": "The One who gives plenty of mercy to all believers and nonbelievers in this world."},
            {"name_arabic": "الرَّحِيمُ", "transliteration": "Ar-Rahim", "meaning": "The Most Compassionate", "explanation": "The One who has plenty of mercy for the believers in the hereafter."},
            {"name_arabic": "الْمَلِكُ", "transliteration": "Al-Malik", "meaning": "The King", "explanation": "The Absolute Ruler, the One who is free of any need of others."},
            {"name_arabic": "الْقُدُّوسُ", "transliteration": "Al-Quddus", "meaning": "The Most Holy", "explanation": "The One who is pure from any imperfection and clear from children and adversaries."},
            {"name_arabic": "السَّلَامُ", "transliteration": "As-Salam", "meaning": "The Source of Peace", "explanation": "The One who is free from every imperfection, and Whose creatures are safe from any injustice on His part."},
            {"name_arabic": "الْمُؤْمِنُ", "transliteration": "Al-Mu'min", "meaning": "The Giver of Faith", "explanation": "The One who witnessed for Himself that no one is God but Him, and Who witnessed for His believers that they are truthful in their belief that no one is God but Him."},
            {"name_arabic": "الْمُهَيْمِنُ", "transliteration": "Al-Muhaymin", "meaning": "The Guardian", "explanation": "The One who witnesses the saying and deeds of His creatures."},
            {"name_arabic": "الْعَزِيزُ", "transliteration": "Al-Aziz", "meaning": "The Almighty", "explanation": "The Defeater who is not defeated."},
            {"name_arabic": "الْجَبَّارُ", "transliteration": "Al-Jabbar", "meaning": "The Compeller", "explanation": "The One that nothing happens in His dominion except that which He willed."},
            {"name_arabic": "الْمُتَكَبِّرُ", "transliteration": "Al-Mutakabbir", "meaning": "The Supreme", "explanation": "The One who is clear from the attributes of the creatures and from resembling them."},
            {"name_arabic": "الْخَالِقُ", "transliteration": "Al-Khaliq", "meaning": "The Creator", "explanation": "The One who brings everything from non-existence to existence."},
            {"name_arabic": "الْبَارِئُ", "transliteration": "Al-Bari'", "meaning": "The Producer", "explanation": "The One who creates the soul and the body."},
            {"name_arabic": "الْمُصَوِّرُ", "transliteration": "Al-Musawwir", "meaning": "The Fashioner", "explanation": "The One who forms His creatures in different pictures."},
            {"name_arabic": "الْغَفَّارُ", "transliteration": "Al-Ghaffar", "meaning": "The Forgiver", "explanation": "The One who forgives the sins of His slaves time and time again."},
            {"name_arabic": "الْقَهَّارُ", "transliteration": "Al-Qahhar", "meaning": "The Subduer", "explanation": "The One who has the perfect power and is not unable over anything."},
            {"name_arabic": "الْوَهَّابُ", "transliteration": "Al-Wahhab", "meaning": "The Bestower", "explanation": "The One who is Generous in giving without a return."},
            {"name_arabic": "الرَّزَّاقُ", "transliteration": "Ar-Razzaq", "meaning": "The Provider", "explanation": "The One who provides sustenance to His creatures."},
            {"name_arabic": "الْفَتَّاحُ", "transliteration": "Al-Fattah", "meaning": "The Opener", "explanation": "The One who opens for His slaves the closed worldly and religious matters."},
            {"name_arabic": "الْعَلِيمُ", "transliteration": "Al-Alim", "meaning": "The All-Knowing", "explanation": "The One who knows everything; nothing is hidden from Him."},
            {"name_arabic": "الْقَابِضُ", "transliteration": "Al-Qabid", "meaning": "The Withholder", "explanation": "The One who constricts the sustenance by His wisdom and expands it by His Generosity."},
            {"name_arabic": "الْبَاسِطُ", "transliteration": "Al-Basit", "meaning": "The Expander", "explanation": "The One who expands and widens sustenance to whomever He willed by His Generosity."},
            {"name_arabic": "الْخَافِضُ", "transliteration": "Al-Khafid", "meaning": "The Abaser", "explanation": "The One who lowers whomever He willed by His Destruction and raises whomever He willed by His Endowment."},
            {"name_arabic": "الرَّافِعُ", "transliteration": "Ar-Rafi", "meaning": "The Exalter", "explanation": "The One who raises whomever He willed by His Endowment."},
            {"name_arabic": "الْمُعِزُّ", "transliteration": "Al-Mu'izz", "meaning": "The Bestower of Honor", "explanation": "He gives esteemed to whomever He willed."},
            {"name_arabic": "الْمُذِلُّ", "transliteration": "Al-Mudhill", "meaning": "The Humiliator", "explanation": "He degrades whomever He willed."},
            {"name_arabic": "السَّمِيعُ", "transliteration": "As-Sami", "meaning": "The All-Hearing", "explanation": "The One who Hears all things without an ear, instrument or organ."},
            {"name_arabic": "الْبَصِيرُ", "transliteration": "Al-Basir", "meaning": "The All-Seeing", "explanation": "The One who Sees all things without an eye or instrument."},
            {"name_arabic": "الْحَكَمُ", "transliteration": "Al-Hakam", "meaning": "The Judge", "explanation": "He is the Ruler and His judgment is His Word."},
            {"name_arabic": "الْعَدْلُ", "transliteration": "Al-Adl", "meaning": "The Just", "explanation": "The One who is entitled to do what He does."},
            {"name_arabic": "اللَّطِيفُ", "transliteration": "Al-Latif", "meaning": "The Subtle One", "explanation": "The One who is kind to His slaves and endowed upon them."},
            {"name_arabic": "الْخَبِيرُ", "transliteration": "Al-Khabir", "meaning": "The All-Aware", "explanation": "The One who knows the internal truth of things."},
            {"name_arabic": "الْحَلِيمُ", "transliteration": "Al-Halim", "meaning": "The Forbearing", "explanation": "The One who delays the punishment for those who deserve it."},
            {"name_arabic": "الْعَظِيمُ", "transliteration": "Al-Azim", "meaning": "The Magnificent", "explanation": "The One who is clear from the attributes of the creatures."},
            {"name_arabic": "الْغَفُورُ", "transliteration": "Al-Ghafur", "meaning": "The All-Forgiving", "explanation": "The One who forgives a lot."},
            {"name_arabic": "الشَّكُورُ", "transliteration": "Ash-Shakur", "meaning": "The Appreciative", "explanation": "The One who gives a lot of reward for a little obedience."},
            {"name_arabic": "الْعَلِيُّ", "transliteration": "Al-Ali", "meaning": "The Most High", "explanation": "The One who is clear from the attributes of the creatures."},
            {"name_arabic": "الْكَبِيرُ", "transliteration": "Al-Kabir", "meaning": "The Most Great", "explanation": "The One who is greater than everything in status."},
            {"name_arabic": "الْحَفِيظُ", "transliteration": "Al-Hafiz", "meaning": "The Preserver", "explanation": "The One who protects whatever He willed to protect."},
            {"name_arabic": "الْمُقِيتُ", "transliteration": "Al-Muqit", "meaning": "The Maintainer", "explanation": "The One who gives the creatures their sustenance."},
            {"name_arabic": "الْحَسِيبُ", "transliteration": "Al-Hasib", "meaning": "The Reckoner", "explanation": "The One who gives the satisfaction."},
            {"name_arabic": "الْجَلِيلُ", "transliteration": "Al-Jalil", "meaning": "The Majestic", "explanation": "The One who is attributed with greatness of Power and Glory of status."},
            {"name_arabic": "الْكَرِيمُ", "transliteration": "Al-Karim", "meaning": "The Generous", "explanation": "The One who is clear from abjectness."},
            {"name_arabic": "الرَّقِيبُ", "transliteration": "Ar-Raqib", "meaning": "The Watchful", "explanation": "The One that nothing is absent from Him."},
            {"name_arabic": "الْمُجِيبُ", "transliteration": "Al-Mujib", "meaning": "The Responsive", "explanation": "The One who answers the one in need if he asks Him and rescues the yearner if he calls upon Him."},
            {"name_arabic": "الْوَاسِعُ", "transliteration": "Al-Wasi", "meaning": "The All-Encompassing", "explanation": "The One who has abundance of Knowledge and Mercy."},
            {"name_arabic": "الْحَكِيمُ", "transliteration": "Al-Hakim", "meaning": "The Wise", "explanation": "The One who is correct in His doings."},
            {"name_arabic": "الْوَدُودُ", "transliteration": "Al-Wadud", "meaning": "The Loving One", "explanation": "The One who loves His believing slaves."},
            {"name_arabic": "الْمَجِيدُ", "transliteration": "Al-Majid", "meaning": "The Glorious", "explanation": "The One who is with perfect Power, High Status, Compassion, Generosity and Kindness."},
            {"name_arabic": "الْبَاعِثُ", "transliteration": "Al-Ba'ith", "meaning": "The Resurrector", "explanation": "The One who resurrects for reward and punishment."},
            {"name_arabic": "الشَّهِيدُ", "transliteration": "Ash-Shahid", "meaning": "The Witness", "explanation": "The One that nothing is absent from Him."},
            {"name_arabic": "الْحَقُّ", "transliteration": "Al-Haqq", "meaning": "The Truth", "explanation": "The One who truly exists."},
            {"name_arabic": "الْوَكِيلُ", "transliteration": "Al-Wakil", "meaning": "The Trustee", "explanation": "The One who gives the satisfaction and is relied upon."},
            {"name_arabic": "الْقَوِيُّ", "transliteration": "Al-Qawi", "meaning": "The Strong", "explanation": "The One with the complete Power."},
            {"name_arabic": "الْمَتِينُ", "transliteration": "Al-Matin", "meaning": "The Firm", "explanation": "The One with extreme Power which is un-interrupted and He does not get tired."},
            {"name_arabic": "الْوَلِيُّ", "transliteration": "Al-Wali", "meaning": "The Friend", "explanation": "The One who helps and gives victory to the believers."},
            {"name_arabic": "الْحَمِيدُ", "transliteration": "Al-Hamid", "meaning": "The Praiseworthy", "explanation": "The One who deserves to be praised."},
            {"name_arabic": "الْمُحْصِي", "transliteration": "Al-Muhsi", "meaning": "The Enumerator", "explanation": "The One that the count of everything is known to Him."},
            {"name_arabic": "الْمُبْدِئُ", "transliteration": "Al-Mubdi'", "meaning": "The Originator", "explanation": "The One who started the human being from non existence to existence."},
            {"name_arabic": "الْمُعِيدُ", "transliteration": "Al-Ma'id", "meaning": "The Restorer", "explanation": "The One who brings back the creatures after death to life on the Day of Judgment."},
            {"name_arabic": "الْمُحْيِي", "transliteration": "Al-Muhyi", "meaning": "The Giver of Life", "explanation": "The One who took out a living human from semen that does not have a soul."},
            {"name_arabic": "الْمُمِيتُ", "transliteration": "Al-Mumit", "meaning": "The Bringer of Death", "explanation": "The One who renders the living dead."},
            {"name_arabic": "الْحَيُّ", "transliteration": "Al-Hayy", "meaning": "The Living", "explanation": "The One who is attributed with a life that is unlike our life and has no beginning nor end."},
            {"name_arabic": "الْقَيُّومُ", "transliteration": "Al-Qayyum", "meaning": "The Self-Subsisting", "explanation": "The One who remains and does not end."},
            {"name_arabic": "الْوَاجِدُ", "transliteration": "Al-Wajid", "meaning": "The Finder", "explanation": "The One who does not lack anything."},
            {"name_arabic": "الْمَاجِدُ", "transliteration": "Al-Maajid", "meaning": "The Noble", "explanation": "The One who is with perfect Power, High Status, Compassion, Generosity and Kindness."},
            {"name_arabic": "الْوَاحِدُ", "transliteration": "Al-Wahid", "meaning": "The Unique", "explanation": "The One with no partner."},
            {"name_arabic": "الْأَحَدُ", "transliteration": "Al-Ahad", "meaning": "The One", "explanation": "The One with no partner."},
            {"name_arabic": "الصَّمَدُ", "transliteration": "As-Samad", "meaning": "The Eternal", "explanation": "The Master who is relied upon in matters and reverted to in ones needs."},
            {"name_arabic": "الْقَادِرُ", "transliteration": "Al-Qadir", "meaning": "The Able", "explanation": "The One who is attributed with Power."},
            {"name_arabic": "الْمُقْتَدِرُ", "transliteration": "Al-Muqtadir", "meaning": "The Powerful", "explanation": "The One with the perfect Power that nothing is impossible for Him."},
            {"name_arabic": "الْمُقَدِّمُ", "transliteration": "Al-Muqaddim", "meaning": "The Expediter", "explanation": "The One who puts things in their right places."},
            {"name_arabic": "الْمُؤَخِّرُ", "transliteration": "Al-Mu'akhkhir", "meaning": "The Delayer", "explanation": "The One who delays whatever He willed."},
            {"name_arabic": "الْأَوَّلُ", "transliteration": "Al-Awwal", "meaning": "The First", "explanation": "The One whose Existence is without a beginning."},
            {"name_arabic": "الْآخِرُ", "transliteration": "Al-Akhir", "meaning": "The Last", "explanation": "The One whose Existence is without an end."},
            {"name_arabic": "الظَّاهِرُ", "transliteration": "Az-Zahir", "meaning": "The Manifest", "explanation": "The One that nothing is above Him and nothing is underneath Him."},
            {"name_arabic": "الْبَاطِنُ", "transliteration": "Al-Batin", "meaning": "The Hidden", "explanation": "The One that nothing is above Him and nothing is underneath Him."},
            {"name_arabic": "الْوَالِي", "transliteration": "Al-Wali", "meaning": "The Governor", "explanation": "The One who owns things and manages them."},
            {"name_arabic": "الْمُتَعَالِي", "transliteration": "Al-Muta'ali", "meaning": "The Most Exalted", "explanation": "The One who is clear from the attributes of the creatures."},
            {"name_arabic": "الْبَرُّ", "transliteration": "Al-Barr", "meaning": "The Source of All Goodness", "explanation": "The One who is kind to His creatures and covered them with His sustenance."},
            {"name_arabic": "التَّوَّابُ", "transliteration": "At-Tawwab", "meaning": "The Acceptor of Repentance", "explanation": "The One who grants repentance to whomever He willed among His creatures and accepts his repentance."},
            {"name_arabic": "الْمُنْتَقِمُ", "transliteration": "Al-Muntaqim", "meaning": "The Avenger", "explanation": "The One who victoriously prevails over His enemies and punishes them for their sins."},
            {"name_arabic": "الْعَفُوُّ", "transliteration": "Al-Afuww", "meaning": "The Pardoner", "explanation": "The One with a very wide forgiveness."},
            {"name_arabic": "الرَّؤُوفُ", "transliteration": "Ar-Ra'uf", "meaning": "The Compassionate", "explanation": "The One with extreme Mercy."},
            {"name_arabic": "مَالِكُ الْمُلْكِ", "transliteration": "Malik-ul-Mulk", "meaning": "The Eternal Owner of Sovereignty", "explanation": "The One who controls the dominion and gives dominion to whomever He willed."},
            {"name_arabic": "ذُو الْجَلَالِ وَالْإِكْرَامِ", "transliteration": "Dhu-l-Jalali wa-l-Ikram", "meaning": "The Lord of Majesty and Bounty", "explanation": "The One who deserves to be Exalted and not denied."},
            {"name_arabic": "الْمُقْسِطُ", "transliteration": "Al-Muqsit", "meaning": "The Equitable", "explanation": "The One who is Just in His judgment."},
            {"name_arabic": "الْجَامِعُ", "transliteration": "Al-Jami", "meaning": "The Gatherer", "explanation": "The One who gathers the creatures on a day that there is no doubt about, that is the Day of Judgment."},
            {"name_arabic": "الْغَنِيُّ", "transliteration": "Al-Ghani", "meaning": "The Self-Sufficient", "explanation": "The One who does not need the creatures."},
            {"name_arabic": "الْمُغْنِي", "transliteration": "Al-Mughni", "meaning": "The Enricher", "explanation": "The One who satisfies the necessities of the creatures."},
            {"name_arabic": "الْمَانِعُ", "transliteration": "Al-Mani", "meaning": "The Preventer", "explanation": "The One who prevents whomever He willed from whatever He willed."},
            {"name_arabic": "الضَّارُّ", "transliteration": "Ad-Darr", "meaning": "The Distressor", "explanation": "The One who makes harm reach whomever He willed and benefit reach whomever He willed."},
            {"name_arabic": "النَّافِعُ", "transliteration": "An-Nafi", "meaning": "The Propitious", "explanation": "The One who makes harm reach whomever He willed and benefit reach whomever He willed."},
            {"name_arabic": "النُّورُ", "transliteration": "An-Nur", "meaning": "The Light", "explanation": "The One who guides whomever He willed to the light of Faith."},
            {"name_arabic": "الْهَادِي", "transliteration": "Al-Hadi", "meaning": "The Guide", "explanation": "The One who with His Guidance His believers were guided to the light of Faith."},
            {"name_arabic": "الْبَدِيعُ", "transliteration": "Al-Badi", "meaning": "The Incomparable", "explanation": "The One who created the creatures and designed them without any preceding example."},
            {"name_arabic": "الْبَاقِي", "transliteration": "Al-Baqi", "meaning": "The Everlasting", "explanation": "The One that the state of non-existence is impossible for Him."},
            {"name_arabic": "الْوَارِثُ", "transliteration": "Al-Warith", "meaning": "The Inheritor", "explanation": "The One whose Existence remains after His creatures perish."},
            {"name_arabic": "الرَّشِيدُ", "transliteration": "Ar-Rashid", "meaning": "The Guide to the Right Path", "explanation": "The One who guides whomever He willed to the right path."},
            {"name_arabic": "الصَّبُورُ", "transliteration": "As-Sabur", "meaning": "The Patient", "explanation": "The One who does not quickly punish the sinners."}
        ]
        
        for n_data in names:
            AsmaulHusna.objects.get_or_create(transliteration=n_data['transliteration'], defaults=n_data)

        self.stdout.write(self.style.SUCCESS("All 99 Asmaul Husna seeded successfully."))
