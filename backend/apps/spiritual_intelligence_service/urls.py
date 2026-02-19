from django.urls import path
from . import views

urlpatterns = [
    path('plan/', views.DeenPlanDetailView.as_view(), name='deen-plan'),
    path('fiqh/consult/', views.fiqh_consult, name='fiqh-consult'),
    path('analytics/summary/', views.worship_analytics, name='worship-analytics'),
    path('log/', views.log_worship, name='log-worship'),
]
