# DeenFlow Deployment Guide (Production)

This guide provides step-by-step instructions to deploy DeenFlow using **Render** (Backend), **Vercel** (Frontend), and **Supabase** (Database).

## Phase 1: Database Setup (Supabase)

1. **Create Account:** Go to [supabase.com](https://supabase.com/) and sign up.
2. **Create Project:** Create a new project named `DeenFlow`.
3. **Get Connection String:**
   - Go to **Project Settings > Database**.
   - Copy the **URI** connection string.
   - It should looks like: `postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
   - *Note: Ensure you include `?sslmode=require` at the end of your URI when using it in Render.*

## Phase 2: Backend Deployment (Render)

1. **Create Web Service:**
   - Login to [Render](https://render.com/).
   - Click **New + > Web Service**.
   - Connect your GitHub repository.
2. **Configure Service:**
   - **Language:** Python
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command:** `gunicorn config.wsgi --log-file -` (Note: Ensure the path matches your project structure. If your wsgi is in `deenflow.wsgi`, use `deenflow.wsgi`).
3. **Environment Variables:** Add the following in Render's **Environment** tab:
   - `DEBUG`: `False`
   - `SECRET_KEY`: *[Generate a random string]*
   - `DATABASE_URL`: *[Your Supabase URI]?sslmode=require*
   - `DJANGO_ALLOWED_HOSTS`: `your-backend.onrender.com`
   - `PAYMENTS_ENABLED`: `False`
   - `JWT_SECRET_KEY`: *[Generate another random string]*
   - `OPENAI_API_KEY`: *[Your OpenAI Key]* (If applicable)

## Phase 3: Frontend Deployment (Vercel)

1. **Create Project:**
   - Login to [Vercel](https://vercel.com/).
   - Click **Add New > Project**.
   - Import your GitHub repository.
2. **Configure Build:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variables:**
   - `VITE_API_URL`: `https://your-backend.onrender.com` (The URL Render gives you).

## Phase 4: Post-Deployment Steps

1. **Migrations:**
   - Once the Render backend is live, log into Render's dashboard.
   - Go to the **Shell** tab of your service.
   - Run:
     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```
2. **Create Admin User:**
   - In the same Render Shell, run:
     ```bash
     python manage.py createsuperuser
     ```

## Future Payment Activation (M-Pesa/Bank)

When you are ready to enable payments:
1. Set `PAYMENTS_ENABLED=True` in Render Environment Variables.
2. Add the following M-Pesa/Bank credentials to Render:
   - `MPESA_SHORTCODE`
   - `MPESA_CONSUMER_KEY`
   - `MPESA_CONSUMER_SECRET`
   - `MPESA_PASSKEY`
   - `BANK_API_KEY`
3. Redeploy the backend.
4. The system is designed to check `settings.PAYMENTS_ENABLED` to toggle features.

## Verification Checklist

- [ ] Check if backend `/api/health/` (or similar) returns 200.
- [ ] Log in via the Vercel URL.
- [ ] Verify that data (Quran, Questions, etc.) is being fetched from the database.
- [ ] Confirm no payment UI is visible.
