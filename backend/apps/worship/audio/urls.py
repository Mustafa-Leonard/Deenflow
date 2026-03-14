from django.urls import path
from . import views

urlpatterns = [
    path('audio/', views.QuranAudioView.as_view(), name='quran-audio'),
    path('reciters/', views.ReciterListView.as_view(), name='reciter-list'),
]
