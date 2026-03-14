from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

def custom_404(request, exception=None):
    logger.warning(f"404 Not Found: {request.path} [Method: {request.method}]")
    return JsonResponse({
        "error": "Not Found",
        "path": request.path,
        "message": "The requested resource was not found. Please check your VITE_API_URL."
    }, status=404)
