from django.contrib import admin
from django.urls import path
from accounts.views import register_end_user, login
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import CustomTokenVerifyView

urlpatterns = [
    path("register/", register_end_user, name='register_end_user' ),
    path("login/", login, name='login'),
    path("token/refresh/",TokenRefreshView.as_view(), name='token_refresh' ),
    path("token/verify/", CustomTokenVerifyView.as_view(), name='token_verify'),
    path("token/obtain/", TokenObtainPairView.as_view(), name='token_obtain_pair')
]
