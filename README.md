# DeenFlow — DeenInContext

This repository contains a production-oriented SaaS scaffold for "DeenInContext – Islamic Life Context Guidance System" with a Django backend and React (Vite) frontend.

Quick start (backend):

1. cd backend
2. python -m venv .venv && .\.venv\Scripts\activate
3. pip install -r requirements.txt
4. copy .env.example .env and set DATABASE_URL and OPENAI_API_KEY
5. python manage.py migrate
6. python manage.py createsuperuser
7. python manage.py runserver

Quick start (frontend):

1. cd frontend
2. npm install
3. copy .env.example .env
4. npm run dev

Postgres example (local):

psql -c "CREATE USER deenflow WITH PASSWORD 'password';"
psql -c "CREATE DATABASE deenflow_db OWNER deenflow;"

Production notes:
- Use environment variables for secrets.
- Serve backend with Gunicorn/uvicorn + Nginx.
- Build frontend with `npm run build` and serve from CDN or Nginx.
