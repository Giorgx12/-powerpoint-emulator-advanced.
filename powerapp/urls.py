from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('save/', views.save_presentation, name='save'),
    path('load/', views.load_presentation, name='load'),
]
