# apps/products/views.py
from rest_framework import generics, filters, permissions, status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from apps.users.models import ArtisanProfile
from apps.core_utils import cache_or_compute, invalidate_product_cache

class ProductListView(generics.ListAPIView):
    """List all products with filtering"""
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'artisan__business_name']
    ordering_fields = ['price', 'created_at', 'average_rating']
    ordering = ['-created_at']
    
    @method_decorator(cache_page(60 * 10))  # Cache for 10 minutes - cache key based on query params
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, stock_quantity__gt=0)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by artisan
        artisan = self.request.query_params.get('artisan')
        if artisan:
            queryset = queryset.filter(artisan__artisan__id=artisan)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    @method_decorator(cache_page(60 * 30))  # Cache for 30 minutes
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class ArtisanListView(generics.ListAPIView):
    """List all verified artisans"""
    serializer_class = serializers.Serializer  # We'll use a simple serializer
    queryset = ArtisanProfile.objects.filter(profile_verified=True)
    
    @method_decorator(cache_page(60 * 20))  # Cache for 20 minutes
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        artisans = self.get_queryset()
        data = []
        for artisan in artisans:
            products = Product.objects.filter(artisan=artisan, is_active=True)[:3]  # Get 3 sample products
            # include avatar absolute URL if available
            avatar_url = None
            try:
                if artisan.artisan.avatar:
                    avatar_url = request.build_absolute_uri(artisan.artisan.avatar.url)
            except Exception:
                avatar_url = None

            data.append({
                'id': artisan.artisan.id,
                'business_name': artisan.business_name,
                'craft_specialty': artisan.craft_specialty,
                'experience_years': artisan.experience_years,
                'average_rating': artisan.average_rating,
                'total_sales': artisan.total_sales,
                'image': avatar_url,
                'sample_products': ProductSerializer(products, many=True, context={'request': request}).data
            })
        return Response(data)


# Template views

def home_view(request):
    categories = Category.objects.all()
    artisans = ArtisanProfile.objects.filter(profile_verified=True)[:6]
    products = Product.objects.filter(is_active=True, stock_quantity__gt=0).order_by('-created_at')[:12]
    context = {
        'categories': categories,
        'artisans': artisans,
        'products': products,
    }
    return render(request, 'products/home.html', context)


def product_list_view(request):
    category_slug = request.GET.get('category')
    artisan_id = request.GET.get('artisan')
    products = Product.objects.filter(is_active=True, stock_quantity__gt=0)
    categories = Category.objects.all()
    artisans = ArtisanProfile.objects.filter(profile_verified=True)

    if category_slug:
        products = products.filter(category__slug=category_slug)
    if artisan_id:
        products = products.filter(artisan__artisan__id=artisan_id)

    context = {
        'products': products,
        'categories': categories,
        'artisans': artisans,
        'selected_category': category_slug,
        'selected_artisan': artisan_id,
    }
    return render(request, 'products/product_list.html', context)


def product_detail_view(request, slug):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    context = {
        'product': product,
        'images': product.images.all(),
    }
    return render(request, 'products/product_detail.html', context)


def artisan_list_view(request):
    artisans = ArtisanProfile.objects.filter(profile_verified=True)
    context = {
        'artisans': artisans,
    }
    return render(request, 'products/artisan_list.html', context)


def artisan_detail_view(request, artisan_id):
    artisan_profile = get_object_or_404(ArtisanProfile, artisan__id=artisan_id, profile_verified=True)
    products = Product.objects.filter(artisan=artisan_profile, is_active=True)
    context = {
        'artisan_profile': artisan_profile,
        'products': products,
    }
    return render(request, 'products/artisan_detail.html', context)

class ArtisanDetailView(generics.RetrieveAPIView):
    """Get artisan details and their products"""
    serializer_class = serializers.Serializer
    queryset = ArtisanProfile.objects.filter(profile_verified=True)
    lookup_field = 'artisan__id'
    
    def retrieve(self, request, *args, **kwargs):
        artisan_profile = self.get_object()
        products = Product.objects.filter(artisan=artisan_profile, is_active=True)
        
        data = {
            'id': artisan_profile.artisan.id,
            'business_name': artisan_profile.business_name,
            'craft_specialty': artisan_profile.craft_specialty,
            'experience_years': artisan_profile.experience_years,
            'average_rating': artisan_profile.average_rating,
            'total_sales': artisan_profile.total_sales,
            'image': None,
            'bio': artisan_profile.artisan.bio,
            'country': artisan_profile.artisan.country,
            'products': ProductSerializer(products, many=True, context={'request': request}).data
        }
        try:
            if artisan_profile.artisan.avatar:
                data['image'] = request.build_absolute_uri(artisan_profile.artisan.avatar.url)
        except Exception:
            data['image'] = None

        return Response(data)