from django.urls import path, include

urlpatterns = [
    path('prayer/', include('worship.prayer.urls')),
    path('quran/', include('worship.audio.urls')),
    path('translations/', include('worship.translations.urls')),
    path('dhikr/', include('worship.dhikr.urls')),
    path('duas/', include('worship.duas.urls')),
    path('reminders/', include('worship.reminders.urls')),
    path('categories/', include('worship.categories.urls')),
    path('asmaul-husna/', include('worship.asmaul_husna.urls')),
    path('favorites/', include('worship.favorites.urls')),
    path('alarms/', include('worship.prayer.alarms_urls')),
]
