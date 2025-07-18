from django.shortcuts import render
from django.http import JsonResponse
import json

# Dizionario di esempio per le presentazioni
presentations = {}

def index(request):
    return render(request, 'powerapp/index.html')

def save_presentation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        presentation_id = data.get('id', 'default')
        presentations[presentation_id] = data
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'})

def load_presentation(request):
    presentation_id = request.GET.get('id', 'default')
    data = presentations.get(presentation_id, {})
    return JsonResponse(data)
