from django.db import models

# Create your models here.
from django.contrib.gis.db import models
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point


class Shop(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=250)
    category = models.CharField(max_length=100)

    # Store location properly in PostGIS database
    # Use srid=4326 for (latitude, longitude) format
    location = models.PointField(geography=True, srid=4326)

    created_at = models.DateTimeField(auto_now_add=True)  # optional but useful

    def __str__(self):
        return self.name

    @property
    def latitude(self):
        return self.location.y

    @property
    def longitude(self):
        return self.location.x
