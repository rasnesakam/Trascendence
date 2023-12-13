from django.urls import  path, include
from django.views.generic.base import RedirectView
from trascendence.api.views.UserView import UserView
from trascendence.api.views import AuthView
from trascendence.api.views import Hello

# Write decorator to restrict http methods for requests
# auth_redirect -> 42/oauth -> auth/token/code -> page

urlpatterns = [
    path('users', UserView.as_view()),
    path('auth/sign-in', AuthView.sign_in),
    path('auth/sign-up', AuthView.sign_up),
    path('auth_redirect', AuthView.OAuth),
    path('auth/token/code', AuthView.token)
]
