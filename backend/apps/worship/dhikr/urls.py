from django.urls import path
from . import views

urlpatterns = [
    path('', views.DhikrListView.as_view(), name='dhikr-list'),
    path('<uuid:pk>/', views.DhikrDetailView.as_view(), name='dhikr-detail'),
    path('log/', views.DhikrLogView.as_view(), name='dhikr-log'),
]
