from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SignupSerializer
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserDetailSerializer

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework import generics, permissions
from .models import Shop
from .serializers import ShopSerializer
from .permissions import IsOwnerOrAdmin
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Shop
from .serializers import ShopSerializer
from .permissions import IsOwnerOrAdmin

class SignupAPIView(APIView):
    """
    POST /api/signup/
    """
    permission_classes = []  # AllowAny by default; you can add permissions if needed

    def post(self, request, *args, **kwargs):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # return minimal safe info (do NOT return password)
            data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # create tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)



class UserDetailAPIView(RetrieveUpdateAPIView):
    """
    GET  /api/user/    -> returns current user's details
    PATCH /api/user/   -> partial update (preferred)
    PUT   /api/user/   -> full update
    """
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ShopListCreateAPIView(generics.ListCreateAPIView):
    """
    GET  /api/shops/  -> list shops (see behavior below)
        - Anonymous users: see ALL shops (and can search/filter)
        - Authenticated users:
            * default (no ?all=true): see ONLY shops owned by request.user
            * if ?all=true (toggle ON): see ALL shops (and can search/filter)
    POST /api/shops/  -> create shop (authenticated; owner auto-set)
    """
    queryset = Shop.objects.all().order_by('-created_at')
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # enable search/filter/ordering for both anon and auth users
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']                # ?category=Electronics
    search_fields = ['name', 'address', 'category']# ?search=term
    ordering_fields = ['created_at', 'name']       # ?ordering=created_at or -created_at

    def get_queryset(self):
        """
        Return shops according to rules:
        - If the request user is anonymous -> return ALL shops (subject to search/filter).
        - If authenticated:
            - If query param all=true -> return ALL shops (subject to search/filter).
            - Otherwise -> return only shops owned by the user (subject to search/filter).
        """
        base_qs = super().get_queryset()
        user = self.request.user
        all_param = self.request.query_params.get('all')

        # If anonymous -> return all shops
        if not (user and user.is_authenticated):
            return base_qs

        # Authenticated user:
        if all_param is None:
            # No toggle provided -> default: show only user's shops
            return base_qs.filter(owner=user).order_by('-created_at')

        # If toggle present, treat truthy values as request for "all shops"
        if str(all_param).lower() in ('1', 'true', 'yes', 'on'):
            return base_qs

        # If toggle present but false -> show only user's shops
        return base_qs.filter(owner=user).order_by('-created_at')

    def perform_create(self, serializer):
        # owner set automatically to requesting user
        serializer.save(owner=self.request.user)


class ShopRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/shops/<pk>/    -> retrieve (public)
    PATCH  /api/shops/<pk>/    -> update (owner or superuser only)
    DELETE /api/shops/<pk>/    -> delete (owner or superuser only)
    """
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]

    # Note: object-level permission IsOwnerOrAdmin will be checked for unsafe methods.