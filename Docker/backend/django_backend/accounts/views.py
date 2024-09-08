from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EndUserSerializer, LoginSerializer
from django.core.files.base import ContentFile
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
import base64
import cv2
import numpy as np
import face_recognition
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import io
from .models import EndUser
from scipy.spatial.distance import cosine

# Load a pre-trained model (e.g., ResNet50) for feature extraction
model = models.resnet50(pretrained=True)
model.eval()  # Set model to evaluation mode

# Define preprocessing transforms
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


@api_view(['POST'])
def register_end_user(request):
    face_image = request.data.get('face_image')
    
    if face_image:
        try:
            # Decode the base64 image
            image_data = base64.b64decode(face_image)
            image_file = io.BytesIO(image_data)

            image = Image.open(image_file).convert('RGB')  # Convert to RGB
            image_array = np.array(image)  # Convert PIL Image to numpy array
            image_tensor = preprocess(image).unsqueeze(0)  # Add batch dimennsion

            # Extract features using the pre-trained model
            with torch.no_grad():
                features = model(image_tensor)
                feature_data = features.numpy().flatten().tolist()  # Convert to list for JSON serialization

        except Exception as e:
            return Response({'error': f'Error processing face image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        feature_data = None
    
    # Prepare data for serializer
    user_data = {
        'user': request.data.get('user', {}),
        'phone_number': request.data.get('phone_number', ''),
        'face_data': feature_data 
    }

    serializer = EndUserSerializer(data=user_data)
    if serializer.is_valid():
        end_user = serializer.save()
        user = end_user.user
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data  # Include user data if needed
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def face_login(request):
    try:
        face_image = request.data.get('face_image')
        if not face_image:
            return Response({'message': 'No face image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Decode the base64 image
        image_data = base64.b64decode(face_image)
        image_file = io.BytesIO(image_data)
        image = Image.open(image_file).convert('RGB')  # Convert to RGB
        image_tensor = preprocess(image).unsqueeze(0)  # Add batch dimension

        # Extract features using the pre-trained model
        with torch.no_grad():
            features = model(image_tensor)
            feature_data = features.numpy().flatten().tolist()

        # Fetch the user by email (assuming email is provided in the request)
        email = request.data.get('email')
        if not email:
            return Response({'message': 'Email is required for face login'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            end_user = EndUser.objects.get(user__email=email)
        except EndUser.DoesNotExist:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # Compare the extracted features with the stored face data
        stored_feature_data = end_user.face_data
        similarity = 1 - cosine(feature_data, stored_feature_data)

        print(f"Similarity Score: {similarity}")
        if similarity > 0.85:
            # Authentication successful
            user = end_user.user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({'message': f'Error processing face image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):

    if 'face_image' in request.data:
        return face_login(request)
    else:
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        print("Serializer errors:", serializer.errors)
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    



class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        # Extract the token from the request body or headers
        token = request.data.get('token') or request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Decode token and retrieve user info
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            
            # Add user info to response
            user_info = {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
            }
            return Response({'user': user_info}, status=status.HTTP_200_OK)
        
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)