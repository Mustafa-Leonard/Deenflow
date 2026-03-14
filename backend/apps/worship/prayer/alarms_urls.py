from django.urls import path
from . import views

urlpatterns = [
    path('', views.AlarmsView.as_view(), name='alarms-list'),
    path('toggle/', views.AlarmsToggleView.as_view(), name='alarms-toggle'),
]
