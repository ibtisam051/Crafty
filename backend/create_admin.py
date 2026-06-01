import os

import django

# Add the project directory to the Python path
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crafty_backend.settings")
django.setup()

from apps.users.models import User

# Check if admin already exists
admin_exists = User.objects.filter(username="admin").exists()

if admin_exists:
    print("Admin user already exists")
    admin_user = User.objects.get(username="admin")
    # Make sure it's a superuser
    if not admin_user.is_superuser:
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()
        print("Made admin user a superuser")
else:
    # Create new admin user
    admin_user = User.objects.create_superuser(
        username="admin",
        email="admin@example.com",
        password="admin123",
        user_type="admin",
    )
    print(f"Created admin user: {admin_user.username}")
    print("Password: admin123")
