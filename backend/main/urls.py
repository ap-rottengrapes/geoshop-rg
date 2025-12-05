from django.urls import path
from .views import SignupAPIView, LoginAPIView, ShopListCreateAPIView, ShopRetrieveUpdateDestroyAPIView, UserDetailAPIView

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('user/', UserDetailAPIView.as_view(), name='user-detail'),
    path('shops/', ShopListCreateAPIView.as_view(), name='shop-list-create'),
    path('shops/<int:pk>/', ShopRetrieveUpdateDestroyAPIView.as_view(), name='shop-detail'),
]
