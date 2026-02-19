from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DraftAnswerViewSet, AnswerViewSet, SavedAnswerViewSet

router = DefaultRouter()
router.register(r'drafts', DraftAnswerViewSet, basename='draft-answers')
router.register(r'final', AnswerViewSet, basename='final-answers')
router.register(r'saved', SavedAnswerViewSet, basename='saved-answers')

urlpatterns = [
    path('', include(router.urls)),
]
