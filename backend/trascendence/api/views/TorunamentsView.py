from django.views.decorators.http import require_http_methods
from trascendence.middleware.auth import authorize
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseServerError
from trascendence.api.models.User import UserModel
from trascendence.api.models.tournament_models import TournamentPlayers, TournamentInvitations, Tournaments

@require_http_methods(['GET'])
@authorize
def get_tournament_invitations(request: HttpRequest, username: str) -> JsonResponse | HttpResponseNotFound:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": f"User {username} not found"}), content_type="application/json")
    tournament_invitations = [invitation for invitation in TournamentInvitations.objects.filter(target_user=user).values()]
    return JsonResponse({"message": f"there is {len(tournament_invitations)} of invitations", "content": tournament_invitations}, status=200)


@require_http_methods(['GET'])
@authorize
def get_tournament_invitation(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    pass


@require_http_methods(['POST'])
@authorize
def accept_tournamet(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    pass


@require_http_methods(['DELETE'])
@authorize
def decline_tournament(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    pass


@require_http_methods(['GET'])
@authorize
def get_tournaments(request: HttpRequest, tournamentcode: str) -> JsonResponse:
    tournaments = [tournament for tournament in Tournaments.objects.filter(tournament_code__exact=tournamentcode).values()]
    return JsonResponse({"message": f"There is {len(tournaments)} users in tournament", "content": tournaments}, status=200)


@require_http_methods(['GET'])
@authorize
def get_tournaments_for_user(request: HttpRequest, username) -> JsonResponse:
    tournaments_user_query = Tournaments.objects.filter(tournamentplayers_tournament_id__user__username__exact=username)
    user_tournaments = [tournament for tournament in tournaments_user_query.values()]
    return JsonResponse({"message": f"There is {len(user_tournaments)} tournaments that {username} joined", "content": user_tournaments}, status=200)



@require_http_methods(['GET'])
@authorize
def get_tournament(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    pass


@require_http_methods(['GET'])
@authorize
def get_tournament_matches(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    pass


@require_http_methods(['POST'])
@authorize
def create_tournament(request: HttpRequest) -> JsonResponse:
    pass


@require_http_methods(['DELETE'])
@authorize
def remove_tournament_user(request: HttpRequest, tournament: str, username: str) -> JsonResponse | HttpResponseNotFound:
    pass