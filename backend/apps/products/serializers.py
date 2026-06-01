# apps/products/serializers.py
from rest_framework import serializers

from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "image"]


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_primary", "sort_order"]

    def get_image(self, obj):
        try:
            # prefer the storage url if available
            img_url = (
                obj.image.url
                if hasattr(obj.image, "url")
                else (obj.image.name if obj.image else "")
            )
        except Exception:
            img_url = obj.image.name if obj.image else ""

        if not img_url:
            return ""

        request = self.context.get("request")
        # If it's already an absolute URL, return it
        if img_url.startswith("http"):
            return img_url

        # Ensure leading slash
        if not img_url.startswith("/"):
            img_url = "/" + img_url

        if request is not None:
            return request.build_absolute_uri(img_url)
        # fallback to MEDIA_URL
        from django.conf import settings

        return f"{settings.MEDIA_URL.rstrip('/')}" + img_url


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    artisan_name = serializers.CharField(source="artisan.business_name", read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "artisan",
            "artisan_name",
            "category",
            "name",
            "slug",
            "description",
            "price",
            "stock_quantity",
            "materials",
            "dimensions",
            "production_time_days",
            "is_customizable",
            "images",
            "average_rating",
            "created_at",
        ]
