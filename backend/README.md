# DeenFlow Backend

This folder contains the Django backend for DeenInContext.

Setup (local):

1. Create and activate a virtualenv (python -m venv .venv)
2. pip install -r requirements.txt
3. Copy `.env.example` to `.env` and set values (DATABASE_URL, OPENAI_API_KEY, SECRET_KEY)
4. Run migrations: `python manage.py migrate`
5. Create superuser: `python manage.py createsuperuser`
6. Run server: `python manage.py runserver`
