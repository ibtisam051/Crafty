from rest_framework import serializers

from apps.users.serializers import UserSerializer

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source="user", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "product",
            "user",
            "user_details",
            "rating",
            "title",
            "comment",
            "is_verified_purchase",
            "created_at",
        ]
        read_only_fields = ["id", "user", "is_verified_purchase", "created_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        # Check if user purchased the product
        validated_data["is_verified_purchase"] = self._check_verified_purchase(
            validated_data["user"], validated_data["product"]
        )
        return super().create(validated_data)

    def _check_verified_purchase(self, user, product):
        # Check if user has an order with this product
        return user.orders.filter(
            items__product=product, order_status__in=["delivered", "shipped"]
        ).exists()
