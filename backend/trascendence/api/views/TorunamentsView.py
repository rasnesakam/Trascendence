from django.views.decorators.http import require_http_methods
import json
from trascendence.api.models import TournamentMatches
from trascendence.middleware.auth import authorize
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseForbidden, HttpResponseServerError
from trascendence.api.models.User import UserModel
from trascendence.api.models.tournament_models import TournamentPlayers, TournamentInvitations, Tournaments
from trascendence.middleware.validators import request_body, str_field, list_field, number_field
from trascendence.core.notification_manager import push_notification, Notification
from trascendence.core.token_manager import generate_sudo_token
import traceback
from trascendence.api.dto import (
    tournament_invitation_dto,
    tournament_dto,
    tournament_match_dto,
    tournament_player_dto
)

RESOURCE_GROUP_TOURNAMENTS = "tournaments"

@require_http_methods(['GET'])
@authorize()
def get_tournament_invitations(request: HttpRequest) -> JsonResponse | HttpResponseNotFound:
    user = request.auth_info.user
    tournament_invitations = TournamentInvitations.objects.filter(target_user=user)
    response = {
        "length": len(tournament_invitations),
        "content": [tournament_invitation_dto(invite) for invite in tournament_invitations]
    }
    return JsonResponse(response, 200)
    

@require_http_methods(['GET'])
@authorize()
def get_tournament_invitation(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    user = request.auth_info.user
    try:
        tournament_invitation = TournamentInvitations.objects.get(target_user=user, invite_code=invitationcode)
        return JsonResponse(tournament_invitation_dto(tournament_invitation), status=200)
    except TournamentInvitations.DoesNotExist:
        return HttpResponseNotFound()
    

@require_http_methods(['POST'])
@authorize()
def accept_tournamet(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    user = request.auth_info.user
    try:
        tournament_invitation = TournamentInvitations.objects.get(target_user=user, invite_code__exact=invitationcode)
        tournament = tournament_invitation.tournament
        try:
            unpaired_user = TournamentPlayers.objects.get(tournament=tournament_invitation.tournament, has_pair=False)
            TournamentPlayers.objects.create(
                tournament=tournament, user=tournament_invitation.target_user, has_pair=True, pair_user=unpaired_user
            )
            unpaired_user.has_pair = True
            unpaired_user.pair_user = user
            unpaired_user.save()
        except TournamentInvitations.DoesNotExist:
            TournamentPlayers.objects.create(
                tournament=tournament, user=tournament_invitation.target_user, has_pair=False, pair_user=None
            )
        return JsonResponse({"message": "You are now participated in the tournament."}, status=200)
    except TournamentInvitations.DoesNotExist:
        return HttpResponseNotFound(f"No invitation found with code: {invitationcode}")
       

@require_http_methods(['DELETE'])
@authorize()
def decline_tournament(request: HttpRequest, invitationcode: str) -> JsonResponse | HttpResponseNotFound:
    try:
        user = request.auth_info.user
        tournament_invitation = TournamentInvitations.objects.get(invite_code__exact=invitationcode, target_user=user)
        tournament_invitation.delete()
        return JsonResponse({"message": "Invitation declined."}, status=200)
    except TournamentInvitations.DoesNotExist:
        return HttpResponseNotFound(json.dumps({"message":"There is no such tournament"}), content_type="application/json")


@require_http_methods(['GET'])
@authorize()
def get_tournaments(request: HttpRequest) -> JsonResponse:
    tournaments = Tournaments.objects.all()
    response = {
        "length": len(tournaments),
        "content": [tournament_dto(tournament) for tournament in tournaments]
    }
    return JsonResponse(response,status=200)


@require_http_methods(['GET'])
@authorize()
def get_tournaments_for_user(request: HttpRequest, username: str) -> JsonResponse:
    tournaments = Tournaments.objects.filter(tournamentplayers_tournament_id__user__username__exact=username)
    response = {
        "length": len(tournaments),
        "content": [tournament_dto(tournament) for tournament in tournaments]
    }
    return JsonResponse(response, status=200)


@require_http_methods(['GET'])
@authorize()
def get_tournament(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    try:
        tournament = Tournaments.objects.get(tournament_code__exact=tournamentcode)
        tournament_players = TournamentPlayers.objects.filter(tournament=tournament).order_by('-stage')
        return JsonResponse(tournament_dto(tournament, tournament_players), status=200)
    except Tournaments.DoesNotExist:
        return HttpResponseNotFound()


@require_http_methods(['GET'])
@authorize()
def get_tournament_players(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    tournament_players = TournamentPlayers.objects.filter(tournament__tournament_code=tournamentcode).order_by("-stage")
    if tournament_players.exists():
        return HttpResponseNotFound()
    response = {
        "length": len(tournament_players),
        "content": [tournament_player_dto(match) for match in tournament_players]
    }
    return JsonResponse(response, status=200)



@require_http_methods(['GET'])
@authorize()
def get_tournament_matches(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    tournament_matches = TournamentMatches.objects.filter(match__tournament__tournament_code__exact=tournamentcode)
    if tournament_matches.exists():
        return HttpResponseNotFound()
    response = {
        "length": len(tournament_matches),
        "content": [tournament_match_dto(match) for match in tournament_matches]
    }
    return JsonResponse(response, status=200)


@require_http_methods(['POST'])
@authorize()
@request_body(
    content_type="application/json",
    fields={
        "tournamentName": str_field(max_length=30, required=True),
        "users": list_field(required=True),
        "capacity": number_field(max_length=8, min_length=4, required=True)
    }
)
def create_tournament(request: HttpRequest, content) -> JsonResponse:
    founder_user = request.auth_info.user
    participated_users = list()
    usernames = content.get("users", [])
    if len(usernames) != content["capacity"]:
        return JsonResponse({"message":f"Unmatched user list. capacity is {content['capacity']} but {len(usernames)} user invited"}, status=400)
    for username in usernames:
        try:
            participated_user = UserModel.objects.get(username__exact=username)
            participated_users.append(participated_user)
        except UserModel.DoesNotExist:
            return HttpResponseNotFound()
    tournament_name = content["tournamentName"]
    # create tournament
    try:
        tournament = Tournaments.objects.create(tournament_name=tournament_name, created_user=founder_user, players_capacity=content["capacity"])
        # Invite userlist
        for user in participated_users:
            try:
                tournament_message = f"You have been invited to {tournament.tournament_name}!"
                tournament_invitation = TournamentInvitations.objects.create(
                    target_user=user,
                    tournament=tournament,
                    message=tournament_message
                )
                # notify users about this invitations
                notification = Notification(str(user.id), tournament_message, RESOURCE_GROUP_TOURNAMENTS, tournament_invitation.invite_code)
                temp_token = generate_sudo_token()
                push_notification(notification, temp_token)
            except Exception:
                traceback.print_exc()
                return HttpResponseServerError()
    except Exception as error:
        traceback.print_exc()
        return HttpResponseServerError()
    

@require_http_methods(['DELETE'])
@authorize()
def remove_tournament_user(request: HttpRequest, tournament: str, username: str) -> JsonResponse | HttpResponseNotFound:
    try:
        user = request.auth_info.user
        tournament = Tournaments.objects.get(tournament_code=tournament)
        tournament_player = TournamentPlayers.objects.get(tournament=tournament, user__username=username)
        if user.username != tournament.created_user.username and user.username != tournament_player.user.username:
            return JsonResponse({"message": "You have no right to do this."}, status=401)
        if tournament_player.has_pair:
            pair_player = TournamentPlayers.objects.get(user=tournament_player.pair_user)
            pair_player.stage += 1
            pair_player.has_pair = False
            pair_player.pair_user = None
            pair_player.save()
        return JsonResponse({"message": f"Player {tournament_player.user.username} has leaved the tournament"}, status=200)
    except Tournaments.DoesNotExist:
        return JsonResponse({"message": "No such tournament."}, status=404)
    except TournamentPlayers.DoesNotExist:
        return JsonResponse({"message": "No such tournament."}, status=404)
