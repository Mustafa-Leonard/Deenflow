from django.urls import path
from . import views

urlpatterns = [
    path('surahs/', views.SurahListView.as_view(), name='surah-list'),
    path('surahs/<int:number>/', views.SurahDetailView.as_view(), name='surah-detail'),
    path('surahs/<int:number>/ayahs/', views.SurahAyahListView.as_view(), name='surah-ayah-list'),
    path('juz/', views.JuzListView.as_view(), name='juz-list'),
    path('juz/<int:number>/', views.JuzDetailView.as_view(), name='juz-detail'),
    
    path('bookmarks/', views.BookmarkListCreateView.as_view(), name='bookmark-list'),
    path('progress/', views.ProgressListCreateView.as_view(), name='progress-list'),
    path('reflections/', views.ReflectionListCreateView.as_view(), name='reflection-list'),
    
    # Stubs for frontend compatibility
    path('recitations/', views.recitation_list_stub, name='recitation-list'),
    path('translations/', views.translation_list_stub, name='translation-list'),
    
    # Admin URLs
    path('admin/stats/', views.admin_quran_stats, name='admin-quran-stats'),
    path('admin/surahs/', views.SurahListView.as_view(), name='admin-surah-list'),
    path('admin/ayahs/', views.SurahAyahListView.as_view(), name='admin-ayah-list'),
    path('admin/sync/', views.admin_trigger_sync, name='admin-quran-sync'),
    path('admin/recitations/', views.recitation_list_admin_stub, name='admin-recitation-list'),
    path('admin/translations/', views.translation_list_admin_stub, name='admin-translation-list'),
]
