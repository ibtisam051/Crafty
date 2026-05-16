# apps/orders/views.py
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from apps.cart.models import Cart

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    """Convert cart to order"""
    cart = get_object_or_404(Cart, user=request.user)
    
    if not cart.items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    with transaction.atomic():
        # Calculate total
        total = sum(item.subtotal for item in cart.items.all())
        
        # Create order
        order = Order.objects.create(
            customer=request.user,
            cart=cart,
            total_amount=total,
            shipping_address=serializer.validated_data['shipping_address'],
            payment_method=serializer.validated_data.get('payment_method', '')
        )
        
        # Copy cart items to order items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                customization_details=cart_item.customization_details
            )
            
            # Update stock
            product = cart_item.product
            product.stock_quantity -= cart_item.quantity
            product.save()
        
        # Clear cart
        cart.items.all().delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_orders(request):
    """Get user's orders"""
    orders = Order.objects.filter(customer=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)