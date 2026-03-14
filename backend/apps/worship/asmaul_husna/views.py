from rest_framework import views, response, status
from .models import AsmaulHusna

class AsmaulHusnaListView(views.APIView):
    def get(self, request):
        names = AsmaulHusna.objects.all()
        data = [{
            "id": str(n.id),
            "name_arabic": n.name_arabic,
            "transliteration": n.transliteration,
            "meaning": n.meaning,
            "explanation": n.explanation
        } for n in names]
        return response.Response(data)

    def post(self, request):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        try:
            name = AsmaulHusna.objects.create(
                name_arabic=data.get('name_arabic'),
                transliteration=data.get('transliteration'),
                meaning=data.get('meaning'),
                explanation=data.get('explanation', '')
            )
            return response.Response({"id": str(name.id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AsmaulHusnaDetailView(views.APIView):
    def put(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            name = AsmaulHusna.objects.get(id=pk)
            data = request.data
            name.name_arabic = data.get('name_arabic', name.name_arabic)
            name.transliteration = data.get('transliteration', name.transliteration)
            name.meaning = data.get('meaning', name.meaning)
            name.explanation = data.get('explanation', name.explanation)
            name.save()
            return response.Response({"status": "success"})
        except AsmaulHusna.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            name = AsmaulHusna.objects.get(id=pk)
            name.delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except AsmaulHusna.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
