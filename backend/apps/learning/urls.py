from django.urls import path
from . import views

urlpatterns = [
    path('paths/', views.LearningPathListView.as_view(), name='path-list'),
    path('paths/<slug:slug>/', views.LearningPathDetailView.as_view(), name='path-detail'),
    path('lessons/<int:pk>/', views.LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<int:lesson_id>/complete/', views.SubmitQuizView.as_view(), name='quiz-submit'),
]
