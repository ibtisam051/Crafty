# apps/cart/views.py
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, render
from .models import Cart, CartItem, SavedForLater
from .serializers import CartSerializer, AddToCartSerializer, CartItemSerializer
from apps.products.models import Product

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_cart(request):
    """Get user's cart"""
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    """Add product to cart"""
    serializer = AddToCartSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    product = get_object_or_404(Product, id=serializer.validated_data['product_id'])
    
    if product.stock_quantity < serializer.validated_data['quantity']:
        return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
    
    cart, _ = Cart.objects.get_or_create(user=request.user)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={
            'quantity': serializer.validated_data['quantity'],
            'unit_price': product.price,
            'customization_details': serializer.validated_data.get('customization_details', {})
        }
    )
    
    if not created:
        cart_item.quantity += serializer.validated_data['quantity']
        cart_item.save()
    
    return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

@api_view(['PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def update_cart_item(request, item_id):
    """Update or remove cart item"""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    
    if request.method == 'DELETE':
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    # PUT - Update quantity
    quantity = request.data.get('quantity')
    if quantity and quantity > 0:
        cart_item.quantity = quantity
        cart_item.save()
    
    cart = cart_item.cart
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    """Clear all items from cart"""
    cart = get_object_or_404(Cart, user=request.user)
    cart.items.all().delete()
    return Response({'message': 'Cart cleared'})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_for_later(request, item_id):
    """Move cart item to saved for later"""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    
    SavedForLater.objects.get_or_create(
        user=request.user,
        product=cart_item.product
    )
    
    cart_item.delete()
    return Response({'message': 'Item saved for later'})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def move_to_cart(request, saved_id):
    """Move saved item back to cart"""
    saved_item = get_object_or_404(SavedForLater, id=saved_id, user=request.user)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=saved_item.product,
        defaults={
            'quantity': 1,
            'unit_price': saved_item.product.price
        }
    )
    
    saved_item.delete()
    return Response({'message': 'Item moved to cart'})


# Template views
def cart_view(request):
    """Template view for cart"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.all()
    else:
        cart_items = []
    
    context = {
        'cart_items': cart_items,
    }
    return render(request, 'cart/cart.html', context)