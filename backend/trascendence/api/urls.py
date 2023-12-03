from django.urls import  path, include
from trascendence.api.views.UserView import UserView
from trascendence.api.views import AuthView
from trascendence.api.views import Hello

urlpatterns = [
    path('users', UserView.as_view()),
    path('auth',AuthView.auth),
    path('auth/sign-in',AuthView.sign_in),
    path("hello",Hello.hi)
]