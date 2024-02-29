from django.views.decorators.http import require_http_methods
import json
from trascendence.api.models import TournamentMatches
from trascendence.middleware.auth import authorize
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseServerError
from trascendence.api.models.User import UserModel
from trascendence.api.models.tournament_models import TournamentPlayers, TournamentInvitations, Tournaments
from trascendence.middleware.validators import request_body, str_field, list_field, number_field


@require_http_methods(['GET'])
@authorize
def get_tournament_invitations(request: HttpRequest) -> JsonResponse | HttpResponseNotFound:
    user = UserModel.objects.get(username=request.auth_info["sub"])
    if user is None:
        return HttpResponseNotFound(str({"message": f"User {username} not found"}), content_type="application/json")
    tournament_invitations = [invitation for invitation in
                              TournamentInvitations.objects.filter(target_user=user).values()]
    return JsonResponse(
        {"message": f"there is {len(tournament_invitations)} of invitations", "content": tournament_invitations},
        status=200)


@require_http_methods(['GET'])
@authorize
def get_tournament_invitation(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    tournament_invitation = TournamentInvitations.objects.get(invite_code__exact=invitationcode)
    if tournament_invitation is not None:
        return HttpResponseNotFound(str({"message": f"No invitation found with code: {invitationcode}"}))
    return JsonResponse({"message": ""}, status=200)


@require_http_methods(['POST'])
@authorize
def accept_tournamet(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    tournament_invitation = TournamentInvitations.objects.get(invite_code__exact=invitationcode)

    if tournament_invitation is None:
        return HttpResponseNotFound(str({"message": f"No invitation found with code: {invitationcode}"}))
    # TODO: It is good to assume that authorized user requested that function.
    user = tournament_invitation.target_user
    tournament = tournament_invitation.tournament
    unpaired_user = TournamentPlayers.objects.get(tournament=tournament_invitation.tournament, has_pair=False)
    if unpaired_user is not None:
        TournamentPlayers.objects.create(
            tournament=tournament, user=tournament_invitation.target_user, has_pair=True, pair_user=unpaired_user
        )
        unpaired_user.has_pair = True
        unpaired_user.pair_user = user
        unpaired_user.save()
    else:
        TournamentPlayers.objects.create(
            tournament=tournament, user=tournament_invitation.target_user, has_pair=False, pair_user=None
        )
    return JsonResponse({"message": "You are now participated in the tournament."}, status=200)


@require_http_methods(['DELETE'])
@authorize
def decline_tournament(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    tournament_invitation = TournamentInvitations.objects.get(invite_code__exact=invitationcode)

    if tournament_invitation is None:
        return HttpResponseNotFound(str({"message": f"No invitation found with code: {invitationcode}"}))
    tournament_invitation.delete()
    # TODO: It is good to assume that authorized user requested that function.


@require_http_methods(['GET'])
@authorize
def get_tournaments(request: HttpRequest) -> JsonResponse:
    tournaments = [tournament for tournament in
                   Tournaments.objects.all().values()]
    return JsonResponse({"message": f"There is {len(tournaments)} users in tournament", "content": tournaments},
                        status=200)


@require_http_methods(['GET'])
@authorize
def get_tournaments_for_user(request: HttpRequest, user: str) -> JsonResponse:
    tournaments_user_query = Tournaments.objects.filter(tournamentplayers_tournament_id__user__username__exact=user).values()
    user_tournaments = [tournament for tournament in tournaments_user_query.values()]
    return JsonResponse({"message": f"There is {len(user_tournaments)} tournaments that {user} joined",
                         "content": user_tournaments}, status=200)


@require_http_methods(['GET'])
@authorize
def get_tournament(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    tournament = Tournaments.objects.get(tournament_code__exact=tournamentcode)
    if tournament is None:
        return HttpResponseNotFound(str({"message": f"No such tournament with given code"}),
                                    content_type="application/json")
    return JsonResponse({"message": "", "content": tournament}, status=200)


@require_http_methods(['GET'])
@authorize
def get_tournament_matches(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    tournament_matches = TournamentMatches.objects.filter(match__tournament__tournament_code__exact=tournamentcode)
    if tournament_matches.exists():
        return HttpResponseNotFound()
    return JsonResponse({"message": "", "content": [tm for tm in tournament_matches.values()]})


# TODO: Add post body validation
@require_http_methods(['POST'])
@authorize
@request_body(
    content_type="application/json",
    fields={
        "tournamentName": str_field(max_length=30, required=True),
        "users": list_field(required=True),
        "capacity": number_field(max_length=8, min_length=4, required=True)
    }
)
def create_tournament(request: HttpRequest, content) -> JsonResponse:
    try:
        founder_user = UserModel.objects.get(username=request.auth_info["sub"])
        participated_users = list()
        usernames = content.get("users", [])
        if len(usernames) != content["capacity"]:
            return JsonResponse(json.dumps({"message":f"Unmatched user list. capacity is {content["capacity"]} but {len(usernames)} user invited"}), status=400)
        for username in usernames:
            try:
                participated_user = UserModel.objects.get(username__exact=username)
                participated_users.append(participated_user)
            except UserModel.DoesNotExist:
                return JsonResponse(json.dumps({"message": f"User {username} not found"}), 404)
        tournament_name = content["tournamentName"]
        # create tournament
        tournament = Tournaments.objects.create(tournament_name=tournament_name, created_user=founder_user, players_capacity=content["capacity"])
        # Invite userlist
        for user in participated_users:
            invitation = TournamentInvitations.objects.create(
                target_user=user,
                tournament=tournament,
                message=f"You have been invited to {tournament.tournament_name}!"
            )
            # notify users about this invitations
    except UserModel.DoesNotExist:
        return JsonResponse(json.dumps({"message": "User not found"}), status=404)


@require_http_methods(['DELETE'])
@authorize
def remove_tournament_user(request: HttpRequest, tournament: str, username: str) -> JsonResponse | HttpResponseNotFound:
    return JsonResponse({"message": "under construction"}, status=500)
