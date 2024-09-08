from django.urls import path, include
from products.views import ProductListViewSet
from .views import ProductDetailView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'products', ProductListViewSet, basename='product')

urlpatterns = [
    path('', ProductListViewSet.as_view({'get': 'list'}), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail')
]
