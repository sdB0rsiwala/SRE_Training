from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from .models import User
from django.http import JsonResponse
import json
# Create your views here.


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try :     
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            if not all([name, email, password]):
                    return JsonResponse({'error': 'Missing fields'}, status=400)
            user = User(name=name, email=email)
            user.set_password(password)  # Hash the password
            user.save()
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
