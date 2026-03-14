from rest_framework import views, response, status
from .models import DuaItem
from django.apps import apps

class DuaListView(views.APIView):
    def get(self, request):
        category_name = request.query_params.get('category')
        is_quranic_param = request.query_params.get('is_quranic')
        
        duas = DuaItem.objects.all()
        if category_name:
            duas = duas.filter(category__name=category_name)
        if is_quranic_param is not None:
            duas = duas.filter(is_quranic=(is_quranic_param.lower() == 'true'))
        
        # Try to get Ayah model if available
        Ayah = None
        try:
            Ayah = apps.get_model('quran', 'Ayah')
        except (LookupError, ImportError):
            pass

        data = []
        for d in duas:
            arabic_text = d.arabic_text
            translation = d.translation
            
            # If quranic and text is empty, try to fetch from quran app
            if d.is_quranic and not arabic_text and d.verse_reference and Ayah:
                try:
                    surah_num, ayah_num = d.verse_reference.split(':')
                    ayah = Ayah.objects.filter(surah__number=surah_num, ayah_number_in_surah=ayah_num).first()
                    if ayah:
                        arabic_text = ayah.text_arabic
                        translation = ayah.text_translation_en
                except Exception:
                    pass
            
            data.append({
                "id": str(d.id),
                "title": d.title,
                "arabic_text": arabic_text,
                "translation": translation,
                "reference": d.reference,
                "is_quranic": d.is_quranic,
                "verse_reference": d.verse_reference,
                "category": d.category.name,
                "category_id": str(d.category.id)
            })
        return response.Response(data)

    def post(self, request):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        try:
            from worship.categories.models import WorshipCategory
            category = WorshipCategory.objects.get(id=data.get('category_id'))
            dua = DuaItem.objects.create(
                category=category,
                title=data.get('title'),
                arabic_text=data.get('arabic_text', ''),
                translation=data.get('translation', ''),
                reference=data.get('reference', ''),
                is_quranic=data.get('is_quranic', False),
                verse_reference=data.get('verse_reference', '')
            )
            return response.Response({"id": str(dua.id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DuaDetailView(views.APIView):
    def put(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            dua = DuaItem.objects.get(id=pk)
            data = request.data
            if 'category_id' in data:
                from worship.categories.models import WorshipCategory
                dua.category = WorshipCategory.objects.get(id=data.get('category_id'))
            
            dua.title = data.get('title', dua.title)
            dua.arabic_text = data.get('arabic_text', dua.arabic_text)
            dua.translation = data.get('translation', dua.translation)
            dua.reference = data.get('reference', dua.reference)
            dua.is_quranic = data.get('is_quranic', dua.is_quranic)
            dua.verse_reference = data.get('verse_reference', dua.verse_reference)
            dua.save()
            return response.Response({"status": "success"})
        except DuaItem.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff and not getattr(request.user, 'is_admin', False):
            return response.Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            dua = DuaItem.objects.get(id=pk)
            dua.delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except DuaItem.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
