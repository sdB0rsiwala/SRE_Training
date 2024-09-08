from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'description', 'photo', 'date_posted', 'author']
