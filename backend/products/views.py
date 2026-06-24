from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'category__name']
    
    def get_queryset(self):
        qs = Product.objects.filter(is_available=True)
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        if category:
            qs = qs.filter(category__slug=category)
        if featured:
            qs = qs.filter(is_featured=True)
        return qs

class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
