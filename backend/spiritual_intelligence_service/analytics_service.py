from datetime import datetime, timedelta
from django.db.models import Count
from .models import WorshipLog
from analytics.models import DailyInsight, TrendAnalysis

class AnalyticsService:
    def __init__(self, user):
        self.user = user

    def calculate_salah_consistency(self, days=7):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        logs = WorshipLog.objects.filter(
            user=self.user, 
            category__startswith='salah', 
            timestamp__range=[start_date, end_date]
        )
        
        # Group by day and count unique categories (prayers) per day
        daily_counts = logs.extra(select={'day': 'date(timestamp)'}).values('day').annotate(count=Count('category', distinct=True))
        
        total_days_tracked = len(daily_counts)
        if total_days_tracked == 0:
            return 0
            
        perfect_days = sum(1 for d in daily_counts if d['count'] >= 5)
        consistency_score = (perfect_days / total_days_tracked) * 100
        
        return consistency_score

    def generate_daily_insight(self):
        score = self.calculate_salah_consistency()
        
        if score == 100:
            text = "SubhanAllah! You have completed all 5 prayers for the last 7 days. Consistency is the most beloved deed."
        elif score > 70:
            text = "Great progress! You are very close to a perfect week. Keep striving for that 5/5 daily streak."
        else:
            text = "Focus on your Fajr and Isha this week. Establishing these two brings great light into your life."
            
        insight, _ = DailyInsight.objects.update_or_create(
            user=self.user,
            date=datetime.now().date(),
            defaults={'worship_score': score, 'generated_text': text, 'focus_area': 'Salah'}
        )
        return insight
