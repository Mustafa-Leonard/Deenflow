from django.urls import path
from . import views

urlpatterns = [
    path('threads/', views.ThreadListView.as_view(), name='thread-list'),
    path('threads/<uuid:thread_id>/', views.ThreadDetailView.as_view(), name='thread-detail'),
    path('threads/<uuid:thread_id>/send/', views.SendMessageView.as_view(), name='send-message'),
    path('users/', views.AdminUsersForMessagingView.as_view(), name='messaging-users'),
    path('unread/', views.UnreadCountView.as_view(), name='unread-count'),
]
