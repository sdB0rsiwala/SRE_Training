from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # path('', include('backend.urls')),
    path('python/signin', include('login.urls')),
    path('python/signup', include('signup.urls')),
    path('admin/', admin.site.urls)
]
