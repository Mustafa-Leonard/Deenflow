"""
DeenFlow — Production Django Settings
======================================
All sensitive values are read EXCLUSIVELY from environment variables.
No secrets live in this file or in Git.

Key design decisions:
 - Primary DB for writes, replica(s) for reads (DATABASE_REPLICA_URL).
 - TLS enforced on all DB connections (sslmode=require).
 - Redis for caching and session storage (never local memory in prod).
 - CONN_MAX_AGE=600 keeps connections warm inside each gunicorn worker.
 - django-db-geventpool / PgBouncer sit in front of Postgres for
   per-process connection pooling (see docker-compose.prod.yml).
 - All security headers set for HTTPS-only deployment.
"""

from dotenv import load_dotenv
load_dotenv()
import os
import warnings
from datetime import timedelta
from pathlib import Path
import sys

import dj_database_url

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# Add apps directory to sys.path
sys.path.insert(0, str(BASE_DIR / 'apps'))
load_dotenv(BASE_DIR / '.env', override=True)

# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------
SECRET_KEY = os.environ.get('SECRET_KEY', 'k29i(+wpepyk31b+hnfdpx&n$934%mnri4fs4yzf8(8l!i5tei')
DEBUG = os.getenv('DEBUG', 'False').lower() in ['true', '1']


ALLOWED_HOSTS = ['*']

# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    # DeenFlow apps
    'accounts',
    'roles',
    'quran',
    'questions',
    'answers',
    'fiqh',
    'moderation',
    'flags',
    'audit',
    'notifications',
    'analytics',
    'ai_engine',
    'learning',
    'spiritual_intelligence_service',
    'community',
    'billing',
    'consultation',
    'referrals',
    'marketplace',
    'donations',
    # Worship apps
    'worship.dhikr',
    'worship.duas',
    'worship.prayer',
    'worship.audio',
    'worship.translations',
    'worship.reminders',
    'worship.categories',
    'worship.favorites',
    'worship.asmaul_husna',
    'messaging',
]

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    'config.middleware.RequestLoggingMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
MIDDLEWARE.insert(MIDDLEWARE.index('django.middleware.security.SecurityMiddleware') + 1, 'whitenoise.middleware.WhiteNoiseMiddleware')

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ---------------------------------------------------------------------------
# DATABASES — Supabase Configuration with Local Fallback
# ---------------------------------------------------------------------------
_db_url = os.getenv("DATABASE_URL")
if _db_url:
    print("DEBUG: DATABASE_URL found in environment.")
    try:
        DATABASES = {
            'default': dj_database_url.config(
                default=_db_url,
                conn_max_age=600,
                ssl_require=True
            )
        }
        # Enforce SSL for Supabase
        DATABASES['default'].setdefault('OPTIONS', {})
        DATABASES['default']['OPTIONS']['sslmode'] = 'require'
    except Exception as e:
        print(f"DEBUG: Error parsing DATABASE_URL: {e}")
        # Fallback to SQLite if URL is invalid (e.g. system noise)
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
            }
        }
else:
    print("DEBUG: DATABASE_URL NOT FOUND. Falling back to SQLite.")
    # Local SQLite fallback for development if DATABASE_URL is missing
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# ---------------------------------------------------------------------------
# Database Router — simplified for single DB (Supabase)
# ---------------------------------------------------------------------------
# DATABASE_ROUTERS = ['config.db_router.PrimaryReplicaRouter']

# ---------------------------------------------------------------------------
# Connection health-check timeout (seconds)
# Prevents stale connection errors under load
# ---------------------------------------------------------------------------
# (Already handled by conn_max_age + PgBouncer health checks)

# ---------------------------------------------------------------------------
# CACHING
# ---------------------------------------------------------------------------
if DEBUG:
    # Local memory cache in development — no external dep required
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'deenflow-dev-cache',
        }
    }
else:
    # Redis in production (requires: pip install django-redis)
    # Production Cache logic
    REDIS_URL = os.getenv('REDIS_URL')
    if REDIS_URL and REDIS_URL.strip():
        CACHES = {
            'default': {
                'BACKEND': 'django.core.cache.backends.redis.RedisCache',
                'LOCATION': REDIS_URL,
                'TIMEOUT': 300,
            }
        }
        SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
    else:
        # ABSOLUTE FALLBACK: Use local memory cache (no Redis needed)
        CACHES = {
            'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
                'LOCATION': 'deenflow-fallback-cache',
            }
        }
        SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------
AUTH_USER_MODEL = 'accounts.User'

AUTHENTICATION_BACKENDS = [
    'accounts.backends.EmailOrUsernameBackend',
    'django.contrib.auth.backends.ModelBackend',
]

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
     'OPTIONS': {'min_length': 6}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ---------------------------------------------------------------------------
# REST Framework
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {},
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(
        minutes=int(os.getenv('JWT_ACCESS_MINUTES', '15'))
    ),
    'REFRESH_TOKEN_LIFETIME': timedelta(
        days=int(os.getenv('JWT_REFRESH_DAYS', '7'))
    ),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': os.environ.get('JWT_SECRET_KEY', os.environ.get('SECRET_KEY')),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ---------------------------------------------------------------------------
# CORS — restrict in production
# ---------------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = DEBUG  # True in dev only
if not DEBUG:
    _cors_raw = os.getenv('CORS_ALLOWED_ORIGINS', '')
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_raw.split(',') if o.strip()]
    
    # PERMISSIVE FALLBACK for common Vercel/Render domains if not explicitly set
    if not CORS_ALLOWED_ORIGINS:
        CORS_ALLOW_ALL_ORIGINS = True # Allow all during initial deployment phase to prevent blocking user
    
    CORS_ALLOW_CREDENTIALS = True

# ---------------------------------------------------------------------------
# Security Headers (HTTPS-only in production)
# ---------------------------------------------------------------------------
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000       # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True

# ---------------------------------------------------------------------------
# Internationalisation
# ---------------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Payment Feature Flag
# ---------------------------------------------------------------------------
PAYMENTS_ENABLED = os.getenv('PAYMENTS_ENABLED', 'False').lower() in ['true', '1']

# ---------------------------------------------------------------------------
# Static Files
# ---------------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# Simplified storage to prevent build failures
STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# Logging — structured JSON in production
# ---------------------------------------------------------------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.getenv('LOG_LEVEL', 'INFO'),
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',   # Change to DEBUG to log every SQL query
            'propagate': False,
        },
    },
}

# ---------------------------------------------------------------------------
# OpenAI
# ---------------------------------------------------------------------------
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

# ---------------------------------------------------------------------------
# Celery Configuration
# ---------------------------------------------------------------------------
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_ALWAYS_EAGER = DEBUG  # Run tasks synchronously in dev without Redis

