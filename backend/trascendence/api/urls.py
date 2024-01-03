from django.urls import  path, include
from django.views.generic.base import RedirectView
from trascendence.api.views.UserView import UserView
from trascendence.api.views import AuthView
from trascendence.api.views import InteractionsView

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
    path('interacts/friends/<username>', InteractionsView.get_friends),
    path('interacts/friends/<username>/add', InteractionsView.add_friend),
    path('interacts/friends/<username>/delete/<user>', InteractionsView.delete_friend),
    path('interacts/invitation/<username>', InteractionsView.get_invitations),
    path('interacts/invitation/<username>/<invite_code>/accept', InteractionsView.accept_invitation),
    path('interacts/invitation/<username>/<invite_code>/delete', InteractionsView.decline_invitation),
    path('interacts/blacklist/<username>', InteractionsView.get_blacklist),
    path('interacts/blacklist/<username>/add', InteractionsView.add_blacklist),
    path('interacts/blacklist/<issuer_username>/<target_username>/delete', InteractionsView.remove_blacklist),

    # Tournaments
    path('tournaments/invitations'),
    path('tournaments/invitations/<invitationcode>'),
    path('tournaments/invitations/<invitationcode>/accept'),
    path('tournaments/invitations/<invitationcode>/delete'),
    path('tournaments/<tournamentcode>'),
    path('tournaments/<tournamentcode>/matches'),
    path('tournaments/create'),
    path('tournaments/<tournamentcode>/<username>/delete')
]
