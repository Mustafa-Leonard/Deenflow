from rest_framework import views, response, status
from .models import WorshipCategory

class CategoryListView(views.APIView):
    def get(self, request):
        type_param = request.query_params.get('type')
        if type_param:
            cats = WorshipCategory.objects.filter(type=type_param)
        else:
            cats = WorshipCategory.objects.all()
        
        data = [{
            "id": str(c.id),
            "name": c.name,
            "type": c.type,
            "description": c.description
        } for c in cats]
        return response.Response(data)

    def post(self, request):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        try:
            cat = WorshipCategory.objects.create(
                name=data.get('name'),
                type=data.get('type'),
                description=data.get('description', '')
            )
            return response.Response({"id": str(cat.id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailView(views.APIView):
    def put(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            cat = WorshipCategory.objects.get(id=pk)
            data = request.data
            cat.name = data.get('name', cat.name)
            cat.type = data.get('type', cat.type)
            cat.description = data.get('description', cat.description)
            cat.save()
            return response.Response({"status": "success"})
        except WorshipCategory.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            cat = WorshipCategory.objects.get(id=pk)
            cat.delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except WorshipCategory.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
