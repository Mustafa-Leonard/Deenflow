from django.urls import path
from . import views

urlpatterns = [
    path('times/', views.PrayerTimesView.as_view(), name='prayer-times'),
    path('location/', views.PrayerLocationView.as_view(), name='prayer-location'),
    path('alarms/', views.AlarmsView.as_view(), name='alarms-list'),
    path('alarms/toggle/', views.AlarmsToggleView.as_view(), name='alarms-toggle'),
    path('preferences/', views.PreferencesView.as_view(), name='worship-preferences'),
    path('preferences/update/', views.PreferencesUpdateView.as_view(), name='worship-preferences-update'),
]
