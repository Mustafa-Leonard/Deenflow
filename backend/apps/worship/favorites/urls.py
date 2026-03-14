from django.urls import path
from . import views

urlpatterns = [
    path('', views.FavoritesListView.as_view(), name='favorites-list'),
    path('toggle/', views.FavoritesToggleView.as_view(), name='favorites-toggle'),
]
