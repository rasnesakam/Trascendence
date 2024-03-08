
import json
from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponseNotFound, JsonResponse
from django.db.models import Q
from trascendence.middleware.validators import request_body, str_field
from trascendence.middleware.auth import authorize
from trascendence.api.models.tournament_models import Tournaments
from trascendence.api.models.User import UserModel
from trascendence.api.models.match_models import Matches
from trascendence.api.models.tournament_models import TournamentMatches
from django.contrib.auth.hashers import BCryptPasswordHasher
from trascendence.api.dto import user_dto

def create_profile_view(user: UserModel, matches: list, tournament_matches: list, tournaments: list) ->dict:
    response = dict()
    response['username'] = user.username
    response['name'] = user.name
    response['surname'] = user.surname
    response['email'] = user.email
    response['avatarURI'] = user.avatarURI
    response['has_playcode'] = user.has_play_code
    response['matches'] = {
        "length": len(matches),
        "matches": matches
    }
    response['tournamentMatches'] = {
        "length": len(tournament_matches),
        "matches": tournament_matches
    }
    response["tournaments"] = {
        "length": len(tournaments),
        "tournaments": tournaments
    }
    response['rival'] = "emakas"
    return response


@require_http_methods(['GET'])
def get_user_profile(request: HttpRequest, username: str):
    try:
        user = UserModel.objects.get(Q(username__exact=username))
        matches = Matches.objects.filter(Q(home=user) | Q(away=user))
        tournament_matches = TournamentMatches.objects.filter(Q(match__home__exact=user.id) | Q(match__away__exact=user.id))
        tournaments = Tournaments.objects.filter(tournamentplayers_tournament_id__user=user.id)
        profile = create_profile_view(
            user,
            [match for match in matches],
            [match for match in tournament_matches],
            [tournament for tournament in tournaments]
        )
        return JsonResponse(profile, status=200)
    except Exception as e:
        return HttpResponseNotFound(json.dumps({"message":f"user '{username}' not found", "exception": str(e)}), content_type="application/json")
    
@require_http_methods(['PATCH'])
@authorize()
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=False),
        "name": str_field(required=False),
        "surname": str_field(required=False),
        "email": str_field(required=False),
        "avatarURI": str_field(required=False),
        "playcode": str_field(required=False),
        "password": str_field(required=False)
    }
)
def update_profile(request: HttpRequest, content: dict):
    user = request.auth_info.user
    password_hasher = BCryptPasswordHasher()
    if "username" in content.keys():
        user.username = content["username"]
    if "name" in content.keys():
        user.name = content["name"]
    if "surname" in content.keys():
        user.surname = content["surname"]
    if "email" in content.keys():
        user.email = content["email"]
    if "avatarURI" in content.keys():
        user.avatarURI = content["avatarURI"]
    if "playcode" in content.keys():
        user.play_code = password_hasher.encode(content["playcode"], password_hasher.salt())
        user.has_play_code = True
    if "password" in content.keys():
        user.password = password_hasher.encode(content["password"], password_hasher.salt())
    user.save()
    return JsonResponse({"new_user": user_dto(user)})
