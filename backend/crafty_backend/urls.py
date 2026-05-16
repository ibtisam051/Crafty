"""
URL configuration for crafty_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from apps.products.views import (
    home_view,
    product_list_view,
    product_detail_view,
    artisan_list_view,
    artisan_detail_view,
)
from apps.cart.views import cart_view

urlpatterns = [
    path('', home_view, name='home-page'),
    path('shop/', product_list_view, name='product-list-page'),
    path('shop/products/<slug:slug>/', product_detail_view, name='product-detail-page'),
    path('cart/', cart_view, name='cart-page'),
    path('artisans/', artisan_list_view, name='artisan-list-page'),
    path('artisans/<uuid:artisan_id>/', artisan_detail_view, name='artisan-detail-page'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
