from django.urls import path, include
from blog.views import BlogPostListView

urlpatterns = [
    path('', BlogPostListView.as_view(), name='blogpost-list'),
]
