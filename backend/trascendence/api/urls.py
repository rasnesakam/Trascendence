from django.urls import  path, include
from trascendence.api.views.UserView import UserView

urlpatterns = [
    path('users', UserView.as_view()),

]