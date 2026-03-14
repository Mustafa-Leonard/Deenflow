import re

class RemoveDoubleSlashesMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If the path contains double slashes, normalize it
        if '//' in request.path_info:
            request.path_info = re.sub(r'/+', '/', request.path_info)
        
        return self.get_response(request)
