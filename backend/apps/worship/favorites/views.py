from rest_framework import views, response, status
from rest_framework.permissions import IsAuthenticated
from .models import UserFavorite

class FavoritesToggleView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_type = request.data.get('item_type')
        item_id = request.data.get('item_id')
        
        if not item_type or not item_id:
            return response.Response({"error": "item_type and item_id required"}, status=status.HTTP_400_BAD_REQUEST)
        
        fav = UserFavorite.objects.filter(user=request.user, item_type=item_type, item_id=item_id).first()
        if fav:
            fav.delete()
            return response.Response({"status": "removed"})
        else:
            UserFavorite.objects.create(user=request.user, item_type=item_type, item_id=item_id)
            return response.Response({"status": "added"})

class FavoritesListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favs = UserFavorite.objects.filter(user=request.user)
        data = []
        for f in favs:
            item = f.item
            if item:
                title = getattr(item, 'title', None)
                if not title:
                    title = getattr(item, 'translation', None)
                if not title:
                    title = getattr(item, 'transliteration', 'item')
                
                arabic_text = getattr(item, 'arabic_text', getattr(item, 'name_arabic', ''))

                data.append({
                    "id": f.id,
                    "item_type": f.item_type,
                    "item_id": f.item_id,
                    "title": title,
                    "arabic_text": arabic_text
                })
        return response.Response(data)
