from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import ArtisanProfile, User
from .serializers import (
    ArtisanProfileSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


class ArtisanListView(generics.ListAPIView):
    """List all artisans"""

    serializer_class = ArtisanProfileSerializer
    queryset = ArtisanProfile.objects.filter(profile_verified=True)


class ArtisanDetailView(generics.RetrieveAPIView):
    """Get artisan details"""

    serializer_class = ArtisanProfileSerializer
    queryset = ArtisanProfile.objects.filter(profile_verified=True)
    lookup_field = "artisan__id"


@api_view(["POST"])
def register(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(user).data,
                "message": "User registered successfully",
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    """Login user"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        # For session authentication, we can optionally log the user in
        # login(request, user)  # Uncomment if using session auth
        return Response(
            {"user": UserSerializer(user).data, "message": "Login successful"}
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT"])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    """Get or update user profile"""
    if request.method == "GET":
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT"])
@permission_classes([permissions.IsAuthenticated])
def artisan_profile(request):
    """Get or update artisan profile"""
    try:
        profile = request.user.artisan_profile
    except ArtisanProfile.DoesNotExist:
        return Response(
            {"error": "Artisan profile not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = ArtisanProfileSerializer(profile)
        return Response(serializer.data)

    serializer = ArtisanProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
