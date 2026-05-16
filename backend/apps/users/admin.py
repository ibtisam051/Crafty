from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ArtisanProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'user_type', 'is_active', 'date_joined']
    list_filter = ['user_type', 'is_active', 'is_staff']
    search_fields = ['email', 'username']
    ordering = ['-date_joined']

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'avatar', 'country', 'bio')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'avatar', 'country', 'bio')}),
    )

@admin.register(ArtisanProfile)
class ArtisanProfileAdmin(admin.ModelAdmin):
    list_display = ['artisan', 'business_name', 'craft_specialty', 'profile_verified', 'average_rating']
    list_filter = ['profile_verified']
    search_fields = ['business_name', 'artisan__email']