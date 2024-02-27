import json

from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseServerError
from trascendence.middleware.auth import authorize
from trascendence.api.models import Matches
from django.db.models import Q

@require_http_methods(['GET'])
@authorize
def get_matches_for_user(request: HttpRequest, username: str):
    matches = Matches.objects.filter(Q(home__username=username) | Q(away__username=username)).values()
    matches_list = [match for match in matches]
    return JsonResponse(json.dumps({"length": len(matches_list), "matches": matches}))

@require_http_methods(['GET'])
@authorize
def get_matches_for_users(request: HttpRequest, user1: str, user2: str):
    matches = Matches.objects.filter((Q(home__username=user1) & Q(away__username=user2)) | (Q(home__username=user2) & Q(away__username=user1))).values()
    matches_list = [match for match in matches]
    return JsonResponse(json.dumps({"length": len(matches_list), "matches": matches}))

