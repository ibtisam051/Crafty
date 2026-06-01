# apps/cart/serializers.py
from rest_framework import serializers

from apps.products.serializers import ProductSerializer

from .models import Cart, CartItem, SavedForLater


class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source="product", read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_details",
            "quantity",
            "unit_price",
            "customization_details",
            "subtotal",
            "added_at",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "total_items", "subtotal", "created_at", "updated_at"]


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    customization_details = serializers.JSONField(required=False, default=dict)
