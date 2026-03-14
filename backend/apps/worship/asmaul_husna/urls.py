from django.urls import path
from . import views

urlpatterns = [
    path('', views.AsmaulHusnaListView.as_view(), name='asmaul-husna-list'),
    path('<uuid:pk>/', views.AsmaulHusnaDetailView.as_view(), name='asmaul-husna-detail'),
]
