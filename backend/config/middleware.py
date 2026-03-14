import re
import logging

logger = logging.getLogger(__name__)

class BulletproofURLMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Log the raw path for debugging
        logger.info(f"[DEBUG] Incoming: {request.method} {request.path}")

        # 2. Fix multiple slashes (e.g., //api///auth -> /api/auth)
        if '//' in request.path_info:
            request.path_info = re.sub(r'/+', '/', request.path_info)

        # 3. Fix common "Double API" mistake (e.g., /api/api/auth -> /api/auth)
        if request.path_info.startswith('/api/api/'):
            request.path_info = request.path_info.replace('/api/api/', '/api/', 1)
        
        return self.get_response(request)
