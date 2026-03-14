from .models import Reciter, AudioTrack
import uuid

class QuranAudioService:
    @staticmethod
    def get_audio_url(surah, ayah, reciter_id):
        """
        Dynamically generate audio URL based on reciter and position.
        """
        try:
            reciter = Reciter.objects.get(id=reciter_id, is_active=True)
            # Example: Many reciters use a standard format like {base_url}/{surah}{ayah}.mp3
            # But the requirement says audio_tracks has an audio_url. 
            # If no record exists, generate one from reciter's base URL.
            track = AudioTrack.objects.filter(surah_number=surah, ayah_number=ayah, reciter=reciter).first()
            if track:
                return track.audio_url
            
            # Fallback: Generate URL from base URL
            # Format: {base_url}/{surah:03d}{ayah:03d}.mp3 (typical for many Quran servers)
            return f"{reciter.audio_base_url}/{str(surah).zfill(3)}{str(ayah).zfill(3)}.mp3"
        except Reciter.DoesNotExist:
            return None

    @staticmethod
    def list_reciters():
        return Reciter.objects.filter(is_active=True)
