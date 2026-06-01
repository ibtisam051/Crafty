from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.products.models import Product

from .models import Review
from .serializers import ReviewSerializer


class ProductReviewListView(generics.ListCreateAPIView):
    """List and create reviews for a product"""

    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs["product_id"]
        return Review.objects.filter(product_id=product_id).order_by("-created_at")

    def perform_create(self, serializer):
        product = get_object_or_404(Product, id=self.kwargs["product_id"])
        # Check if user already reviewed this product
        if Review.objects.filter(product=product, user=self.request.user).exists():
            raise serializers.ValidationError("You have already reviewed this product")
        serializer.save(product=product)


class UserReviewListView(generics.ListAPIView):
    """List user's reviews"""

    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.reviews.all().order_by("-created_at")


@api_view(["PUT", "DELETE"])
@permission_classes([permissions.IsAuthenticated])
def manage_review(request, review_id):
    """Update or delete user's review"""
    review = get_object_or_404(Review, id=review_id, user=request.user)

    if request.method == "DELETE":
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # PUT - Update review
    serializer = ReviewSerializer(review, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
