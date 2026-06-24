from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('', views.ProductListView.as_view(), name='products'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
]
