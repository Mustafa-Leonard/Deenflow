from django.urls import path
from .views import GuidanceCreateView, GuidanceHistoryView, GuidanceDetailView, SavedReflectionCreateView, SavedReflectionDeleteView, SavedReflectionListView
from accounts.member_views import member_stats, daily_ayah, suggested_topics

urlpatterns = [
    path('', GuidanceCreateView.as_view(), name='guidance_create'),
    path('history/', GuidanceHistoryView.as_view(), name='guidance_history'),
    path('recent/', GuidanceHistoryView.as_view(), name='guidance_recent'),  # Alias for dashboard
    path('<int:pk>/', GuidanceDetailView.as_view(), name='guidance_detail'),
    path('reflections/', SavedReflectionListView.as_view(), name='reflection_list'),
    path('reflections/create/', SavedReflectionCreateView.as_view(), name='reflection_create'),
    path('reflections/<int:pk>/', SavedReflectionDeleteView.as_view(), name='reflection_delete'),
    
    # Member dashboard endpoints
    path('member/stats/', member_stats, name='member_stats'),
    path('daily-ayah/', daily_ayah, name='daily_ayah'),
    path('suggested-topics/', suggested_topics, name='suggested_topics'),
]
