from django.urls import path
from . import views

# http://127.0.0.1:8000/
# http://127.0.0.1:8000/index

urlpatterns = [
    path("", views.home)    
]