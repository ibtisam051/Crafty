from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product
from apps.users.models import ArtisanProfile
import uuid

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Create categories
        categories_data = [
            {'name': 'Textiles', 'slug': 'textiles'},
            {'name': 'Pottery', 'slug': 'pottery'},
            {'name': 'Footwear', 'slug': 'footwear'},
            {'name': 'Carpets', 'slug': 'carpets'},
            {'name': 'Wooden Product', 'slug': 'wooden-product'},
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name']}
            )
            categories[cat_data['name']] = cat
            if created:
                self.stdout.write(f'Created category: {cat.name}')

        # Create artisans
        artisans_data = [
            {'email': 'artisan1@example.com', 'username': 'artisan1', 'business_name': 'Artisan Textiles', 'craft_specialty': 'Textile weaving'},
            {'email': 'artisan2@example.com', 'username': 'artisan2', 'business_name': 'Pottery Master', 'craft_specialty': 'Ceramic pottery'},
            {'email': 'artisan3@example.com', 'username': 'artisan3', 'business_name': 'Shoe Craftsman', 'craft_specialty': 'Handmade footwear'},
            {'email': 'artisan4@example.com', 'username': 'artisan4', 'business_name': 'Carpet Weaver', 'craft_specialty': 'Traditional carpets'},
            {'email': 'artisan5@example.com', 'username': 'artisan5', 'business_name': 'Wood Artisan', 'craft_specialty': 'Wood carving'},
        ]

        artisans = []
        for art_data in artisans_data:
            user, created = User.objects.get_or_create(
                email=art_data['email'],
                defaults={
                    'username': art_data['username'],
                    'user_type': 'artisan',
                    'is_active': True
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.email}')

            profile, created = ArtisanProfile.objects.get_or_create(
                artisan=user,
                defaults={
                    'business_name': art_data['business_name'],
                    'craft_specialty': art_data['craft_specialty'],
                    'profile_verified': True,
                    'experience_years': 5,
                }
            )
            artisans.append(profile)
            if created:
                self.stdout.write(f'Created artisan profile: {profile.business_name}')

        # Create products
        products_data = [
            {'name': 'Shawl', 'category': 'Textiles', 'price': 99.00},
            {'name': 'Wool Scarf', 'category': 'Textiles', 'price': 75.00},
            {'name': 'Cotton Fabric', 'category': 'Textiles', 'price': 45.00},
            {'name': 'Silk Dupatta', 'category': 'Textiles', 'price': 120.00},
            {'name': 'Pashmina Shawl', 'category': 'Textiles', 'price': 150.00},
            {'name': 'Embroidery Dress', 'category': 'Textiles', 'price': 85.00},
            {'name': 'Traditional Fabric', 'category': 'Textiles', 'price': 60.00},
            {'name': 'Handwoven', 'category': 'Textiles', 'price': 110.00},
            {'name': 'Floral Print Cloth', 'category': 'Textiles', 'price': 55.00},
            {'name': 'Vintage Weave', 'category': 'Textiles', 'price': 95.00},
            {'name': 'Vase Set', 'category': 'Pottery', 'price': 80.00},
            {'name': 'Blue Pot', 'category': 'Pottery', 'price': 65.00},
            {'name': 'Ceramic Bowl', 'category': 'Pottery', 'price': 45.00},
            {'name': 'Clay Jar', 'category': 'Pottery', 'price': 70.00},
            {'name': 'Decorative Plate', 'category': 'Pottery', 'price': 55.00},
            {'name': 'Traditional Pot', 'category': 'Pottery', 'price': 90.00},
            {'name': 'Handmade Vase', 'category': 'Pottery', 'price': 85.00},
            {'name': 'Ceramic Dish', 'category': 'Pottery', 'price': 50.00},
            {'name': 'Earthen Pot', 'category': 'Pottery', 'price': 40.00},
            {'name': 'Blue Vase', 'category': 'Pottery', 'price': 95.00},
            {'name': 'Khussa Shoes', 'category': 'Footwear', 'price': 96.00},
            {'name': 'Leather Sandals', 'category': 'Footwear', 'price': 65.00},
            {'name': 'Embroidered Shoes', 'category': 'Footwear', 'price': 88.00},
            {'name': 'Traditional Boots', 'category': 'Footwear', 'price': 120.00},
            {'name': 'Casual Slippers', 'category': 'Footwear', 'price': 45.00},
            {'name': 'Fancy Khussa', 'category': 'Footwear', 'price': 105.00},
            {'name': 'Handcrafted Shoes', 'category': 'Footwear', 'price': 95.00},
            {'name': 'Sandals', 'category': 'Footwear', 'price': 75.00},
            {'name': 'Elegant Khussas', 'category': 'Footwear', 'price': 100.00},
            {'name': 'Silk Shoes', 'category': 'Footwear', 'price': 110.00},
            {'name': 'Persian Carpet', 'category': 'Carpets', 'price': 250.00},
            {'name': 'Wool Rug', 'category': 'Carpets', 'price': 180.00},
            {'name': 'Traditional Carpet', 'category': 'Carpets', 'price': 220.00},
            {'name': 'Hand-Made Rug', 'category': 'Carpets', 'price': 200.00},
            {'name': 'Silk Carpet', 'category': 'Carpets', 'price': 280.00},
            {'name': 'Kilim Rug', 'category': 'Carpets', 'price': 160.00},
            {'name': 'Patchwork Carpet', 'category': 'Carpets', 'price': 190.00},
            {'name': 'Antique Rug', 'category': 'Carpets', 'price': 240.00},
            {'name': 'Tribal Carpet', 'category': 'Carpets', 'price': 210.00},
            {'name': 'Modern Runner', 'category': 'Carpets', 'price': 150.00},
            {'name': 'Turkish Rug', 'category': 'Carpets', 'price': 195.00},
            {'name': 'Berber Carpet', 'category': 'Carpets', 'price': 170.00},
            {'name': 'Floral Rug', 'category': 'Carpets', 'price': 205.00},
            {'name': 'Natural Fiber Rug', 'category': 'Carpets', 'price': 140.00},
            {'name': 'Geometric Carpet', 'category': 'Carpets', 'price': 185.00},
            {'name': 'Wooden Bowl', 'category': 'Wooden Product', 'price': 45.00},
            {'name': 'Wooden Stool', 'category': 'Wooden Product', 'price': 80.00},
            {'name': 'Wooden Table', 'category': 'Wooden Product', 'price': 150.00},
        ]

        for i, prod_data in enumerate(products_data):
            artisan = artisans[i % len(artisans)]  # Cycle through artisans
            category = categories[prod_data['category']]
            slug = prod_data['name'].lower().replace(' ', '-').replace('\'', '')

            product, created = Product.objects.get_or_create(
                slug=slug,
                defaults={
                    'artisan': artisan,
                    'category': category,
                    'name': prod_data['name'],
                    'description': f'Beautiful handmade {prod_data["name"].lower()} crafted with care.',
                    'price': prod_data['price'],
                    'stock_quantity': 10,
                    'materials': 'High-quality materials',
                    'dimensions': 'Standard size',
                    'production_time_days': 7,
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f'Created product: {product.name}')

        # Create a sample customer
        customer, created = User.objects.get_or_create(
            email='customer@example.com',
            defaults={
                'username': 'customer',
                'user_type': 'customer',
                'is_active': True
            }
        )
        if created:
            customer.set_password('password123')
            customer.save()
            self.stdout.write(f'Created customer: {customer.email}')

        self.stdout.write('Database seeding completed!')