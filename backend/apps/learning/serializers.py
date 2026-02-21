from rest_framework import serializers
from .models import LearningPath, Lesson, Quiz, Question, UserProgress

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', 'options')

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = ('id', 'title', 'questions')

class LessonSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    class Meta:
        model = Lesson
        fields = ('id', 'path', 'title', 'order', 'content_markdown', 'video_url', 'duration_minutes', 'quiz')

class LessonSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'order')

class LearningPathSerializer(serializers.ModelSerializer):
    lessons_count = serializers.SerializerMethodField()
    lessons = LessonSummarySerializer(many=True, read_only=True)

    class Meta:
        model = LearningPath
        fields = ('id', 'title', 'slug', 'description', 'thumbnail', 'difficulty', 'lessons_count', 'is_premium', 'lessons')
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()
