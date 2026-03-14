from django.apps import AppConfig

class PrayerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'worship.prayer'
    verbose_name = 'Prayer'

    def ready(self):
        try:
            import worship.prayer.tasks
        except ImportError:
            pass
