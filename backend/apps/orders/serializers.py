from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'unit_price', 
                 'customization_details', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_email', 'cart', 'order_status', 
                 'payment_status', 'total_amount', 'shipping_address', 
                 'payment_method', 'notes', 'items', 'created_at', 'updated_at']

class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    payment_method = serializers.CharField(max_length=50, required=False)