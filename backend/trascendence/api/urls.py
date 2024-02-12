from django.urls import  path, include
from django.views.generic.base import RedirectView
from trascendence.api.views.UserView import UserView
from trascendence.api.views import AuthView
from trascendence.api.views import InteractionsView
from trascendence.api.views import TorunamentsView

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
    path('tournaments/invitations/<username>', TorunamentsView.get_tournament_invitations),
    path('tournaments/invitations/<invitationcode>', TorunamentsView.get_tournament_invitation),
    path('tournaments/invitations/<invitationcode>/accept', TorunamentsView.accept_tournamet),
    path('tournaments/invitations/<invitationcode>/delete', TorunamentsView.decline_tournament),
    path('tournaments/', TorunamentsView.get_tournaments),
    path('tournaments/user/<username>', TorunamentsView.get_tournaments_for_user),
    path('tournaments/<tournamentcode>', TorunamentsView.get_tournament),
    path('tournaments/<tournamentcode>/matches', TorunamentsView.get_tournament_matches),
    path('tournaments/create', TorunamentsView.create_tournament),
    path('tournaments/<tournamentcode>/<username>/delete', TorunamentsView.remove_tournament_user)
]
