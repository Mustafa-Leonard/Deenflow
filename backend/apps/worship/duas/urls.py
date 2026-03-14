from django.urls import path
from . import views

urlpatterns = [
    path('', views.DuaListView.as_view(), name='dua-list'),
    path('<uuid:pk>/', views.DuaDetailView.as_view(), name='dua-detail'),
]
