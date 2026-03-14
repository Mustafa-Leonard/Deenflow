from django.urls import path
from . import views

urlpatterns = [
    path('translation/', views.TranslationView.as_view(), name='quran-translation'),
    path('languages/', views.LanguageListView.as_view(), name='language-list'),
]
