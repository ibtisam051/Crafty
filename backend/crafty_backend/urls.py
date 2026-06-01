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
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from api.custom_token import EmailTokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.generic.base import RedirectView
from apps.products.views import (
    home_view,
    product_list_view,
    product_detail_view,
    artisan_list_view,
    artisan_detail_view,
)
from apps.cart.views import cart_view

# drf-yasg schema view
schema_view = get_schema_view(
    openapi.Info(
        title="Crafty API",
        default_version='v1',
        description="API documentation for Crafty",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', home_view, name='home-page'),
    path('shop/', product_list_view, name='product-list-page'),
    path('shop/products/<slug:slug>/', product_detail_view, name='product-detail-page'),
    path('cart/', cart_view, name='cart-page'),
    path('artisans/', artisan_list_view, name='artisan-list-page'),
    path('artisans/<uuid:artisan_id>/', artisan_detail_view, name='artisan-detail-page'),
    path('admin/', admin.site.urls),
    # Redirect exact /api/ to API docs
    path('api/', RedirectView.as_view(url='/api/docs/', permanent=False)),
    path('api/', include('api.urls')),
    # API documentation (Swagger / Redoc)
    path('api/docs/swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

