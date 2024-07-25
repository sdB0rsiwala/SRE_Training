from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password, make_password
from signup.models import User
import json


# Create your views here.
@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            try:
                user = User.objects.get(email=email)
                if password == user.password:
                    return JsonResponse({'message': 'Login successful'}, status=200)
                else:
                    return JsonResponse({'message': 'Invalid credentials1'}, status=400)    
            except User.DoesNotExist:
                return JsonResponse({'message': 'Invalid credentials2'}, status=400) 
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

