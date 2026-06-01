from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import ArtisanProfile, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "user_type", "avatar", "country", "bio"]
        read_only_fields = ["id"]


class ArtisanProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ArtisanProfile
        fields = [
            "user",
            "business_name",
            "craft_specialty",
            "experience_years",
            "profile_verified",
            "average_rating",
            "total_sales",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password_confirm", "user_type"]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return {"user": user}
