import json

from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseForbidden
from trascendence.middleware.auth import authorize
from trascendence.api.models import Matches, UserModel
from django.db.models import Q
from trascendence.core import validate_token
from trascendence.middleware.validators import request_body, str_field, number_field


@require_http_methods(['GET'])
@authorize
def get_matches_for_user(request: HttpRequest, username: str):
    matches = Matches.objects.filter(Q(home__username=username) | Q(away__username=username)).values()
    matches_list = [match for match in matches]
    return JsonResponse(json.dumps({"length": len(matches_list), "matches": matches}))


@require_http_methods(['GET'])
@authorize
def get_matches_for_users(request: HttpRequest, user1: str, user2: str):
    matches = Matches.objects.filter((Q(home__username=user1) & Q(away__username=user2)) |
                                     (Q(home__username=user2) & Q(away__username=user1))).values()
    matches_list = [match for match in matches]
    return JsonResponse(json.dumps({"length": len(matches_list), "matches": matches}))


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
        return JsonResponse({"message":"Match saved", "content": saved_match.to_json()})
    except:
        return HttpResponseForbidden("Not allowed")
