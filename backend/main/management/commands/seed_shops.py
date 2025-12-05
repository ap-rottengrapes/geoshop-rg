from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.gis.geos import Point
import random

from main.models import Shop  # adjust if your app name differs

User = get_user_model()

WORLD_LOCATIONS = [
    ("New York", 40.7128, -74.0060),
    ("London", 51.5074, -0.1278),
    ("Tokyo", 35.6762, 139.6503),
    ("Delhi", 28.7041, 77.1025),
    ("Mumbai", 19.0760, 72.8777),
    ("Sydney", -33.8688, 151.2093),
    ("Cape Town", -33.9249, 18.4241),
    ("Sao Paulo", -23.5505, -46.6333),
    ("Paris", 48.8566, 2.3522),
    ("Berlin", 52.5200, 13.4050),
    ("Dubai", 25.2048, 55.2708),
    ("Beijing", 39.9042, 116.4074),
    ("Hong Kong", 22.3193, 114.1694),
    ("Singapore", 1.3521, 103.8198),
    ("Los Angeles", 34.0522, -118.2437),
    ("Madrid", 40.4168, -3.7038),
    ("Rome", 41.9028, 12.4964),
    ("Istanbul", 41.0082, 28.9784),
    ("Toronto", 43.651070, -79.347015),
    ("Bangkok", 13.7563, 100.5018),
    ("Jakarta", -6.2088, 106.8456),
    ("Nairobi", -1.2921, 36.8219),
    ("Lagos", 6.5244, 3.3792),
    ("Mexico City", 19.4326, -99.1332),
    ("Amsterdam", 52.3676, 4.9041),
    ("Zurich", 47.3769, 8.5417),
    ("Warsaw", 52.2297, 21.0122),
    ("Stockholm", 59.3293, 18.0686),
    ("Copenhagen", 55.6761, 12.5683),
]

CATEGORIES = [
    "Electronics", "Grocery", "Food", "Cafe", "Clothing", "Pharmacy",
    "Books", "Bakery", "Sports", "Furniture", "Jewelry"
]

class Command(BaseCommand):
    help = "Seed the database with random shops worldwide."

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=40, help='Number of shops to create')

    def handle(self, *args, **options):
        count = options['count']
        users = list(User.objects.all())

        # If no users exist, create one
        if not users:
            self.stdout.write(self.style.WARNING("No users found. Creating default 'seed_user'."))
            user = User.objects.create_user(
                username='seed_user',
                email='seed@example.com',
                password='seedpass123'
            )
            users = [user]

        created = 0

        with transaction.atomic():
            for i in range(count):
                owner = random.choice(users)
                city, lat, lon = random.choice(WORLD_LOCATIONS)
                category = random.choice(CATEGORIES)

                shop = Shop.objects.create(
                    owner=owner,
                    name=f"{city} Shop {i+1}",
                    address=f"{city} Street {random.randint(1,200)}",
                    category=category,
                    location=Point(lon, lat)
                )

                self.stdout.write(self.style.SUCCESS(f"Created shop: {shop.name}"))
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully created {created} shops!"))
