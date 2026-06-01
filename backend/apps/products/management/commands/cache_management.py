import json
from datetime import datetime

from django.core.cache import caches
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Manage application cache - clear, stats, and diagnostics"

    def add_arguments(self, parser):
        parser.add_argument(
            "--action",
            type=str,
            choices=["clear", "stats", "clear-products", "clear-sessions", "info"],
            default="info",
            help="Cache action to perform",
        )
        parser.add_argument(
            "--cache",
            type=str,
            choices=["default", "session", "products", "all"],
            default="all",
            help="Which cache backend to target",
        )

    def handle(self, *args, **options):
        action = options["action"]
        cache_name = options["cache"]

        if action == "clear":
            self.clear_cache(cache_name)
        elif action == "clear-products":
            self.clear_products_cache()
        elif action == "clear-sessions":
            self.clear_sessions_cache()
        elif action == "stats":
            self.show_stats(cache_name)
        else:  # info
            self.show_info()

    def clear_cache(self, cache_name):
        """Clear cache backend(s)"""
        if cache_name == "all":
            for name in ["default", "session", "products"]:
                caches[name].clear()
                self.stdout.write(self.style.SUCCESS(f"✓ Cleared {name} cache"))
        else:
            caches[cache_name].clear()
            self.stdout.write(self.style.SUCCESS(f"✓ Cleared {cache_name} cache"))

    def clear_products_cache(self):
        """Clear only product caches"""
        caches["products"].clear()
        caches["default"].clear()
        self.stdout.write(self.style.SUCCESS("✓ Cleared all product-related caches"))

    def clear_sessions_cache(self):
        """Clear only session caches"""
        caches["session"].clear()
        self.stdout.write(self.style.SUCCESS("✓ Cleared session cache"))

    def show_stats(self, cache_name):
        """Show cache statistics"""
        self.stdout.write("\n" + self.style.SUCCESS("=" * 50))
        self.stdout.write(self.style.SUCCESS("CACHE STATISTICS"))
        self.stdout.write(self.style.SUCCESS("=" * 50))

        if cache_name == "all":
            cache_names = ["default", "session", "products"]
        else:
            cache_names = [cache_name]

        for name in cache_names:
            cache_backend = caches[name]
            self.stdout.write(f"\n{self.style.WARNING(name.upper())} Cache:")
            self.stdout.write(f"  Backend: {cache_backend.__class__.__name__}")

            # Try to get location if available
            if hasattr(cache_backend, "_location"):
                self.stdout.write(f"  Location: {cache_backend._location}")

            # Try to get options
            if hasattr(cache_backend, "_options"):
                options = cache_backend._options
                if "MAX_ENTRIES" in options:
                    self.stdout.write(f"  Max Entries: {options['MAX_ENTRIES']}")

            # Get default timeout
            if hasattr(cache_backend, "default_timeout"):
                timeout = cache_backend.default_timeout
                self.stdout.write(f"  Default Timeout: {timeout}s")

        self.stdout.write("\n" + self.style.SUCCESS("=" * 50) + "\n")

    def show_info(self):
        """Show cache configuration info"""
        self.stdout.write("\n" + self.style.SUCCESS("=" * 50))
        self.stdout.write(self.style.SUCCESS("CACHE CONFIGURATION"))
        self.stdout.write(self.style.SUCCESS("=" * 50))

        self.stdout.write("\nAvailable Caches:")
        self.stdout.write("  1. default    - General application cache (5 min timeout)")
        self.stdout.write("  2. session    - Session cache (1 hour timeout)")
        self.stdout.write("  3. products   - Product listings cache (30 min timeout)")

        self.stdout.write("\nCached Endpoints:")
        self.stdout.write("  • /api/products/        (10 minutes)")
        self.stdout.write("  • /api/categories/      (30 minutes)")
        self.stdout.write("  • /api/artisans/        (20 minutes)")

        self.stdout.write("\nUsage Examples:")
        self.stdout.write("  python manage.py cache_management --action clear")
        self.stdout.write(
            "  python manage.py cache_management --action clear --cache products"
        )
        self.stdout.write(
            "  python manage.py cache_management --action stats --cache default"
        )
        self.stdout.write("  python manage.py cache_management --action clear-products")
        self.stdout.write("  python manage.py cache_management --action clear-sessions")

        self.stdout.write("\n" + self.style.SUCCESS("=" * 50) + "\n")
