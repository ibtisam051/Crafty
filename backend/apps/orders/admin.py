from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["subtotal"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "customer",
        "order_status",
        "payment_status",
        "total_amount",
        "created_at",
    ]
    list_filter = ["order_status", "payment_status", "created_at"]
    search_fields = ["customer__email", "id"]
    readonly_fields = ["id", "created_at", "updated_at"]
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["order", "product", "quantity", "unit_price", "subtotal"]
    list_filter = ["product__category"]
    search_fields = ["order__customer__email", "product__name"]
    readonly_fields = ["subtotal"]
