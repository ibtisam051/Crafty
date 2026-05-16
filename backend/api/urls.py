from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.products.views import ProductListView, ProductDetailView, CategoryListView, ArtisanListView, ArtisanDetailView
from apps.cart.views import get_cart, add_to_cart, update_cart_item, clear_cart, save_for_later, move_to_cart
from apps.orders.views import create_order, my_orders
from apps.users.views import register, login, profile, artisan_profile, ArtisanListView as UserArtisanListView, ArtisanDetailView as UserArtisanDetailView
from apps.reviews.views import ProductReviewListView, UserReviewListView, manage_review

urlpatterns = [
    # Products
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    
    # Artisans
    path('artisans/', ArtisanListView.as_view(), name='artisan-list'),
    path('artisans/<uuid:artisan__id>/', ArtisanDetailView.as_view(), name='artisan-detail'),
    
    # Cart
    path('cart/', get_cart, name='get-cart'),
    path('cart/add/', add_to_cart, name='add-to-cart'),
    path('cart/items/<uuid:item_id>/', update_cart_item, name='update-cart-item'),
    path('cart/clear/', clear_cart, name='clear-cart'),
    path('cart/items/<uuid:item_id>/save/', save_for_later, name='save-for-later'),
    path('cart/saved/<uuid:saved_id>/move/', move_to_cart, name='move-to-cart'),
    
    # Orders
    path('orders/', my_orders, name='my-orders'),
    path('orders/create/', create_order, name='create-order'),
    
    # Users
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('users/profile/', profile, name='profile'),
    path('users/artisan-profile/', artisan_profile, name='artisan-profile'),
    
    # Reviews
    path('products/<uuid:product_id>/reviews/', ProductReviewListView.as_view(), name='product-reviews'),
    path('reviews/', UserReviewListView.as_view(), name='user-reviews'),
    path('reviews/<uuid:review_id>/', manage_review, name='manage-review'),
]