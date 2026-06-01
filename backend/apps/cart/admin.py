from django.contrib import admin

from .models import Cart, CartItem, SavedForLater


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ["subtotal"]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["user", "total_items", "subtotal", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email"]
    inlines = [CartItemInline]
    readonly_fields = ["total_items", "subtotal"]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["cart", "product", "quantity", "unit_price", "subtotal"]
    list_filter = ["product__category"]
    search_fields = ["cart__user__email", "product__name"]
    readonly_fields = ["subtotal"]


@admin.register(SavedForLater)
class SavedForLaterAdmin(admin.ModelAdmin):
    list_display = ["user", "product", "saved_at"]
    list_filter = ["saved_at"]
    search_fields = ["user__email", "product__name"]
