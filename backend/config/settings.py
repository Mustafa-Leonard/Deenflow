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

import os
import warnings
from datetime import timedelta
from pathlib import Path
import sys

from dotenv import load_dotenv
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
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-insecure-key-replace-in-prod')
DEBUG = os.getenv('DEBUG', 'False').lower() in ['true', '1']


ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost').split(',')

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
]

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # whitenoise serves static files in production (requires: pip install whitenoise)
    # Skipped in DEBUG mode — Django's default static handler is used instead.
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
if not DEBUG:
    MIDDLEWARE.insert(2, 'whitenoise.middleware.WhiteNoiseMiddleware')

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
# DATABASES — Primary (writes) + Replica (reads)
# ---------------------------------------------------------------------------
# PgBouncer is the connection pool layer that sits between Django and Postgres.
# Django connects to PgBouncer, not directly to Postgres.
# sslmode=require enforces TLS for every connection.

def _build_db(url_env_var: str, conn_max_age: int = 600) -> dict:
    raw = os.environ.get(url_env_var, '').strip()
    if not raw:
        raise RuntimeError(
            f"Required environment variable '{url_env_var}' is not set. "
            "Check your .env or container secrets."
        )
    cfg = dj_database_url.parse(raw, conn_max_age=conn_max_age)
    # Enforce TLS on every DB connection
    cfg.setdefault('OPTIONS', {})
    cfg['OPTIONS']['sslmode'] = os.getenv('DB_SSLMODE', 'require')
    # Optionally pin server cert for mutual TLS
    ssl_cert = os.getenv('DB_SSLROOTCERT')
    if ssl_cert:
        cfg['OPTIONS']['sslrootcert'] = ssl_cert
    return cfg


if DEBUG:
    # Development: allow sqlite fallback so runserver just works
    _db_url = os.getenv('DATABASE_URL', '').strip()
    if _db_url:
        try:
            DATABASES = {
                'default': dj_database_url.parse(_db_url, conn_max_age=60),
            }
            DATABASES['default'].setdefault('OPTIONS', {})
            DATABASES['default']['OPTIONS']['sslmode'] = os.getenv('DB_SSLMODE', 'disable')
        except Exception as _e:
            warnings.warn(
                f"DATABASE_URL is set but invalid ('{_db_url[:40]}…'): {_e}\n"
                "Falling back to SQLite. Fix DATABASE_URL in .env to use PostgreSQL."
            )
            DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': BASE_DIR / 'db.sqlite3',
                }
            }
    else:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
else:
    # Production: enforce real Postgres with TLS
    DATABASES = {
        'default': _build_db('DATABASE_URL'),           # Primary — WRITES
    }
    _replica_url = os.getenv('DATABASE_REPLICA_URL', '').strip()
    if _replica_url:
        DATABASES['replica'] = _build_db('DATABASE_REPLICA_URL')  # Replica — READS

# ---------------------------------------------------------------------------
# Database Router — send reads to replica, writes to primary
# ---------------------------------------------------------------------------
DATABASE_ROUTERS = ['config.db_router.PrimaryReplicaRouter']

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
    REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379/0')
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': REDIS_URL,
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            },
            'TIMEOUT': 300,
        }
    }
    # Use Redis for sessions too (not DB) in production
    SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
    SESSION_CACHE_ALIAS = 'default'

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
     'OPTIONS': {'min_length': 12}},
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
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': os.getenv('DRF_ANON_RATE', '20/min'),
        'user': os.getenv('DRF_USER_RATE', '120/min'),
    },
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
    CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
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
# Static Files
# ---------------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
# whitenoise compressed storage in production only (requires: pip install whitenoise)
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

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

