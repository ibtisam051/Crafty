import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ("customer", "Customer"),
        ("artisan", "Artisan"),
        ("admin", "Admin"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    user_type = models.CharField(
        max_length=20, choices=USER_TYPE_CHOICES, default="customer"
    )
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.user_type})"


class ArtisanProfile(models.Model):
    artisan = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="artisan_profile"
    )
    business_name = models.CharField(max_length=255)
    craft_specialty = models.CharField(max_length=255)
    experience_years = models.IntegerField(default=0)
    profile_verified = models.BooleanField(default=False)
    verification_documents = models.JSONField(default=dict)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_sales = models.IntegerField(default=0)

    def __str__(self):
        return self.business_name or self.artisan.email
