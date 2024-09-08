from django.contrib.auth.models import User
from rest_framework import serializers
from .models import EndUser
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class EndUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = EndUser
        fields = ['user', 'phone_number', 'face_data']  # Include face_data in fields

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        face_data = validated_data.pop('face_data', None)  # Handle face_data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            end_user = EndUser.objects.create(user=user, face_data=face_data, **validated_data)
            return end_user
        else:
            raise serializers.ValidationError(user_serializer.errors)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid email or password')
        return {
            'user': user
        }