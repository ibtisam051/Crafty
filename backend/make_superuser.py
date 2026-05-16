import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crafty_backend.settings')
django.setup()

from apps.users.models import User

# Make artisan1 a superuser
try:
    user = User.objects.get(username='artisan1')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"User {user.username} is now a superuser")
except User.DoesNotExist:
    print("User artisan1 not found")
except Exception as e:
    print(f"Error: {e}")