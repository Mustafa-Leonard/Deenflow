from rest_framework import views, response, status
from rest_framework.permissions import IsAuthenticated
from .models import DhikrItem, UserDhikrLog
from worship.categories.models import WorshipCategory

class DhikrListView(views.APIView):
    def get(self, request):
        category_name = request.query_params.get('category')
        if category_name:
            dhikrs = DhikrItem.objects.filter(category__name=category_name)
        else:
            dhikrs = DhikrItem.objects.all()
        
        data = [{
            "id": str(d.id),
            "arabic_text": d.arabic_text,
            "translation": d.translation,
            "transliteration": d.transliteration,
            "repeat_default": d.repeat_default,
            "category": d.category.name,
            "category_id": str(d.category.id),
            "source_reference": d.source_reference
        } for d in dhikrs]
        return response.Response(data)

    def post(self, request):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        try:
            category = WorshipCategory.objects.get(id=data.get('category_id'))
            dhikr = DhikrItem.objects.create(
                category=category,
                arabic_text=data.get('arabic_text'),
                translation=data.get('translation', ''),
                transliteration=data.get('transliteration', ''),
                repeat_default=data.get('repeat_default', 1),
                source_reference=data.get('source_reference', '')
            )
            return response.Response({"id": str(dhikr.id)}, status=status.HTTP_201_CREATED)
        except WorshipCategory.DoesNotExist:
            return response.Response({"error": "Category not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DhikrDetailView(views.APIView):
    def put(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            dhikr = DhikrItem.objects.get(id=pk)
            data = request.data
            if 'category_id' in data:
                dhikr.category = WorshipCategory.objects.get(id=data.get('category_id'))
            
            dhikr.arabic_text = data.get('arabic_text', dhikr.arabic_text)
            dhikr.translation = data.get('translation', dhikr.translation)
            dhikr.transliteration = data.get('transliteration', dhikr.transliteration)
            dhikr.repeat_default = data.get('repeat_default', dhikr.repeat_default)
            dhikr.source_reference = data.get('source_reference', dhikr.source_reference)
            dhikr.save()
            return response.Response({"status": "success"})
        except DhikrItem.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            dhikr = DhikrItem.objects.get(id=pk)
            dhikr.delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except DhikrItem.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)

class DhikrLogView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        dhikr_id = request.data.get('dhikr_id')
        count = request.data.get('count', 0)
        
        if not dhikr_id:
            return response.Response({"error": "dhikr_id required"}, status=status.HTTP_400_BAD_REQUEST)
        
        log, created = UserDhikrLog.objects.get_or_create(
            user=request.user,
            dhikr_id=dhikr_id
        )
        log.count += int(count)
        log.save()
        
        return response.Response({"status": "success", "total_count": log.count})
