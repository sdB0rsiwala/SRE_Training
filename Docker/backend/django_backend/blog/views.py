from rest_framework import generics
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostListView(generics.ListAPIView):
    queryset = BlogPost.objects.all().order_by('-date_posted')
    serializer_class = BlogPostSerializer
