import uuid

from django.db import models

from apps.users.models import ArtisanProfile, User


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    artisan = models.ForeignKey(
        ArtisanProfile, on_delete=models.CASCADE, related_name="products"
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    materials = models.TextField(blank=True)
    dimensions = models.CharField(max_length=100, blank=True)
    production_time_days = models.IntegerField(default=7)
    is_customizable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        return self.reviews.aggregate(models.Avg("rating"))["rating__avg"] or 0


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="products/")
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
