from django.urls import  path, include
from django.views.generic.base import RedirectView
from trascendence.api.views.UserView import UserView
from trascendence.api.views import AuthView
from trascendence.api.views import Hello

# Write decorator to restrict http methods for requests
# auth_redirect -> 42/oauth -> auth/token/code -> page

urlpatterns = [
    path('users', UserView.as_view()),

    # Authentication
    path('auth/sign-in', AuthView.sign_in),
    path('auth/sign-up', AuthView.sign_up),
    path('auth_redirect', AuthView.OAuth),
    path('auth/token/code', AuthView.token),

    # Interactions
    path('interacts/friends/<username>'),
    path('interacts/friends/<username>/add'),
    path('interacts/friends/<username>/delete/<username>'),
    path('interacts/invitation/<username>'),
    path('interacts/invitation/<username>/<invite_code>/accept'),
    path('interacts/invitation/<username>/<invite_code>/delete'),
    path('interacts/blacklist/<username>'),
    path('interacts/blacklist/<username>/add'),
    path('interacts/blacklist/<username>/<user>/delete')

]
