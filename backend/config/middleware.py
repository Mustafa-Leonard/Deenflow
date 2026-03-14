import re
import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f"[DEBUG] Incoming Request: {request.method} {request.path}")
        return self.get_response(request)

class RemoveDoubleSlashesMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if '//' in request.path_info:
            old_path = request.path_info
            request.path_info = re.sub(r'/+', '/', request.path_info)
            logger.info(f"Fixed double slash: {old_path} -> {request.path_info}")
        
        return self.get_response(request)
