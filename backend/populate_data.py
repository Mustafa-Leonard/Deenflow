
import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User
from guidance.models import GuidanceRequest, SavedReflection

def populate():
    print("Populating data...")
    
    # Create users
    users = []
    for i in range(5):
        u, created = User.objects.get_or_create(email=f'user{i}@example.com', defaults={'username': f'user{i}'})
        if created:
            u.set_password('password123')
            u.save()
        users.append(u)
    
    # Create Guidance Requests
    topics = ['Prayer', 'Fasting', 'Zakat', 'Hajj', 'Marriage', 'Business']
    for i in range(20):
        user = random.choice(users)
        topic = random.choice(topics)
        gr = GuidanceRequest.objects.create(
            user=user, 
            input_text=f"What is the ruling on {topic} in this situation?",
            category=topic,
            response_json={'answer': 'This is a mock answer.'},
            status='done'
        )
        # Randomize date
        gr.created_at = datetime.now() - timedelta(days=random.randint(0, 10))
        gr.save()
        
    print("Data populated.")

if __name__ == '__main__':
    populate()
