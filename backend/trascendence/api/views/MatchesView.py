import json

from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseForbidden
from trascendence.middleware.auth import authorize
from trascendence.api.models import Matches, UserModel
from django.db.models import Q
from trascendence.core import validate_token
from trascendence.middleware.validators import request_body, str_field, number_field
from trascendence.api.dto import match_dto
from trascendence.core.token_manager import validate_token
from django.utils.timezone import now

@require_http_methods(['GET'])
@authorize()
def get_matches_for_user(request: HttpRequest, username: str):
    matches = Matches.objects.filter(Q(home__username=username) | Q(away__username=username))
    matches_list = [match_dto(match) for match in matches]
    return JsonResponse({"length": len(matches_list), "matches": matches_list}, status=200)


@require_http_methods(['GET'])
@authorize()
def get_matches_for_users(request: HttpRequest, user1: str, user2: str):
    matches = Matches.objects.filter((Q(home__username=user1) & Q(away__username=user2)) |
                                     (Q(home__username=user2) & Q(away__username=user1)))
    matches_list = [match_dto(match) for match in matches]
    return JsonResponse({"length": len(matches_list), "matches": matches_list}, status=200)


@require_http_methods(['POST'])
@request_body(
    content_type="application/json",
    fields={
        "home": {
            "score": number_field(required=True),
            "token": str_field(required=True)
        },
        "away": {
            "score": number_field(required=True),
            "token": str_field(required=True)
        }
    }
)
def submit_matches_for_users(request: HttpRequest, content):
    token_home = content["home"]["token"]
    token_away = content["away"]["token"]
    score_home = content["home"]["score"]
    score_away = content["away"]["score"]
    try:
        valid_home = validate_token(token_home)
        valid_away = validate_token(token_away)
        user_home = UserModel.objects.get(username=valid_home["sub"])
        user_away = UserModel.objects.get(username=valid_away["sub"])
        saved_match = Matches.objects.create(
            home=user_home,
            away=user_away,
            score_home=score_home,
            score_away=score_away,
            winner=(user_away if score_away > score_home else user_home),
            is_played=True,
            home_signature=token_home,
            away_signature=token_away
        )
        return JsonResponse({"message":"Match saved", "content": match_dto(saved_match)}, status=201)
    except:
        return HttpResponseForbidden("Not allowed")


@require_http_methods(['POST'])
@request_body(
    content_type="application/json",
    fields={
        "home": {
            "score": number_field(required=True),
            "token": str_field(required=True)
        },
        "away": {
            "score": number_field(required=True),
            "token": str_field(required=True)
        }
    }
)
def submit_planned_match(request: HttpRequest, matchcode, content) -> HttpResponse:
    try:
        planned_match = Matches.objects.get(match_code=matchcode, is_played=False)
        home = planned_match.home
        away = planned_match.away
        home_token_verified = validate_token(content["home"]["token"])
        away_token_verified = validate_token(content["away"]["token"])
        if home_token_verified["sub"] != home.id or away_token_verified["sub"] != away.id:
            return HttpResponseForbidden(json.dumps({"message": "Invalid tokens provided."}), content_type="application/json")
        score_home = content["home"]["score"]
        score_away = content["away"]["score"]
        planned_match.score_home = score_home
        planned_match.home_signature = content["home"]["token"]
        planned_match.score_away = score_away
        planned_match.away_signature = content["away"]["token"]
        planned_match.is_played = True
        planned_match.played_time = now()
        planned_match.winner = home if score_away > score_home else away
        planned_match.save()
        if planned_match.tournament is not None:
            pass
    except Matches.DoesNotExist:
        return HttpResponseNotFound(json.dumps({"message": "No such match"}), content_type="application/json")


@require_http_methods(['GET'])
def get_planned_match(request: HttpRequest, matchcode):
    pass