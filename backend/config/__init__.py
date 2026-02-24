try:
	from .celery import app as celery_app
except Exception:
	# If Celery isn't installed or config raises during import, allow
	# management scripts to run without the Celery app present.
	celery_app = None

__all__ = ('celery_app',)
