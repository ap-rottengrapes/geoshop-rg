from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import Shop

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)  # confirm

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user



class UserDetailSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    password2 = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2')
        read_only_fields = ('id', 'username')  # prevent username change here

    def validate(self, attrs):
        pwd = attrs.get('password')
        pwd2 = attrs.get('password2')
        if pwd or pwd2:
            if not pwd or not pwd2:
                raise serializers.ValidationError({
                    "password": "Both password and password2 are required to change the password."
                })
            if pwd != pwd2:
                raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('password2', None)

        # update remaining fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance



class ShopSerializer(serializers.ModelSerializer):
    # Accept lat/lon in input
    latitude = serializers.FloatField(write_only=True, required=False)
    longitude = serializers.FloatField(write_only=True, required=False)

    # Read-only fields to return lat/lon
    lat = serializers.SerializerMethodField(read_only=True)
    lon = serializers.SerializerMethodField(read_only=True)

    # Owner read-only (shows username)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Shop
        fields = (
            'id', 'owner', 'name', 'address', 'category',
            'latitude', 'longitude', 'lat', 'lon', 'created_at'
        )
        read_only_fields = ('id', 'owner', 'lat', 'lon', 'created_at')

    def get_lat(self, obj):
        return obj.location.y if obj.location else None

    def get_lon(self, obj):
        return obj.location.x if obj.location else None

    def validate(self, attrs):
        lat_present = 'latitude' in attrs
        lon_present = 'longitude' in attrs
        if lat_present ^ lon_present:  # one provided but not the other
            raise serializers.ValidationError("Both latitude and longitude must be provided together.")
        return attrs

    def create(self, validated_data):
        lat = validated_data.pop('latitude', None)
        lon = validated_data.pop('longitude', None)
        if lat is not None and lon is not None:
            validated_data['location'] = Point(lon, lat)  # Point(x=lon, y=lat)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lat = validated_data.pop('latitude', None)
        lon = validated_data.pop('longitude', None)
        if lat is not None and lon is not None:
            instance.location = Point(lon, lat)
        # update other fields normally
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance