import os
import sys

import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crafty_backend.settings")
django.setup()

import pathlib

from django.conf import settings

from apps.products.models import Category, Product, ProductImage
from apps.users.models import ArtisanProfile, User

# Create categories
categories_data = [
    {"name": "Textiles", "slug": "textiles"},
    {"name": "Pottery", "slug": "pottery"},
    {"name": "Footwear", "slug": "footwear"},
    {"name": "Carpets", "slug": "carpets"},
    {"name": "Wooden Product", "slug": "wooden-product"},
]

categories = {}
for cat_data in categories_data:
    cat, created = Category.objects.get_or_create(
        slug=cat_data["slug"], defaults={"name": cat_data["name"]}
    )
    categories[cat_data["name"]] = cat
    print(
        f"Created category: {cat.name}" if created else f"Category exists: {cat.name}"
    )

# Create artisans
artisans_data = [
    {
        "email": "artisan1@example.com",
        "username": "artisan1",
        "business_name": "Artisan Textiles",
        "craft_specialty": "Textile weaving",
    },
    {
        "email": "artisan2@example.com",
        "username": "artisan2",
        "business_name": "Pottery Master",
        "craft_specialty": "Ceramic pottery",
    },
    {
        "email": "artisan3@example.com",
        "username": "artisan3",
        "business_name": "Shoe Craftsman",
        "craft_specialty": "Handmade footwear",
    },
    {
        "email": "artisan4@example.com",
        "username": "artisan4",
        "business_name": "Carpet Weaver",
        "craft_specialty": "Traditional carpets",
    },
    {
        "email": "artisan5@example.com",
        "username": "artisan5",
        "business_name": "Wood Artisan",
        "craft_specialty": "Wood carving",
    },
]

artisans = []
for art_data in artisans_data:
    user, created = User.objects.get_or_create(
        email=art_data["email"],
        defaults={
            "username": art_data["username"],
            "user_type": "artisan",
            "is_active": True,
        },
    )
    if created:
        user.set_password("password123")
        user.save()
        print(f"Created user: {user.email}")

    profile, created = ArtisanProfile.objects.get_or_create(
        artisan=user,
        defaults={
            "business_name": art_data["business_name"],
            "craft_specialty": art_data["craft_specialty"],
            "profile_verified": True,
            "experience_years": 5,
        },
    )
    artisans.append(profile)
    print(
        f"Created artisan profile: {profile.business_name}"
        if created
        else f"Artisan exists: {profile.business_name}"
    )
    # Attach an avatar if a default artist image exists
    try:
        media_avatars_dir = pathlib.Path(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "media", "avatars")
        )
        if media_avatars_dir.exists():
            # pick the first avatar file in the directory (e.g., artist.png)
            avatar_files = list(media_avatars_dir.iterdir())
            if avatar_files:
                avatar_name = avatar_files[0].name
                rel_path = f"avatars/{avatar_name}"
                if not user.avatar:
                    user.avatar = rel_path
                    user.save()
                    print(f"Set avatar for user {user.email} to {rel_path}")
    except Exception as e:
        print("Error attaching avatar to user", user.email, e)

# Create a few products
products_data = [
    {"name": "Shawl", "category": "Textiles", "price": 99.00},
    {"name": "Wool Scarf", "category": "Textiles", "price": 75.00},
    {"name": "Cotton Fabric", "category": "Textiles", "price": 45.00},
    {"name": "Vase Set", "category": "Pottery", "price": 80.00},
    {"name": "Blue Pot", "category": "Pottery", "price": 65.00},
    {"name": "Khussa Shoes", "category": "Footwear", "price": 96.00},
    {"name": "Persian Carpet", "category": "Carpets", "price": 250.00},
    {"name": "Wooden Bowl", "category": "Wooden Product", "price": 45.00},
]

for i, prod_data in enumerate(products_data):
    artisan = artisans[i % len(artisans)]
    category = categories[prod_data["category"]]
    slug = prod_data["name"].lower().replace(" ", "-").replace("'", "")

    product, created = Product.objects.get_or_create(
        slug=slug,
        defaults={
            "artisan": artisan,
            "category": category,
            "name": prod_data["name"],
            "description": f'Beautiful handmade {prod_data["name"].lower()} crafted with care.',
            "price": prod_data["price"],
            "stock_quantity": 10,
            "materials": "High-quality materials",
            "dimensions": "Standard size",
            "production_time_days": 7,
            "is_active": True,
        },
    )
    print(
        f"Created product: {product.name}"
        if created
        else f"Product exists: {product.name}"
    )
    # Attach an image file from the frontend images if available
    try:
        # media_products_dir points to backend/media/products
        media_products_dir = pathlib.Path(
            os.path.join(
                os.path.dirname(os.path.abspath(__file__)), "media", "products"
            )
        )
        if media_products_dir.exists():
            # try to find a file matching the slug or name
            candidates = list(media_products_dir.iterdir())
            match = None
            for f in candidates:
                fname = f.name.lower()
                if slug in fname or prod_data["name"].lower().replace(" ", "") in fname:
                    match = f.name
                    break
            # fallback: try filenames that start with first word
            if not match:
                first_word = prod_data["name"].split(" ")[0].lower()
                for f in candidates:
                    if f.name.lower().startswith(first_word):
                        match = f.name
                        break

            if match:
                image_rel_path = f"products/{match}"
                pi, picreated = ProductImage.objects.get_or_create(
                    product=product,
                    defaults={
                        "image": image_rel_path,
                        "is_primary": True,
                        "sort_order": 0,
                    },
                )
                print(
                    f"Attached image {image_rel_path} to product {product.name}"
                    if picreated
                    else f"Image exists for {product.name}"
                )
    except Exception as e:
        print("Error attaching image to product", product.name, e)

# Create a sample customer
customer, created = User.objects.get_or_create(
    email="customer@example.com",
    defaults={"username": "customer", "user_type": "customer", "is_active": True},
)
if created:
    customer.set_password("password123")
    customer.save()
    print(f"Created customer: {customer.email}")
else:
    print(f"Customer exists: {customer.email}")

print("Database seeding completed!")
