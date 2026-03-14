from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReminderListView.as_view(), name='reminder-list'),
    path('create/', views.ReminderListView.as_view(), name='reminder-create'),
]
