from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseServerError
from trascendence.middleware.auth import authorize
from trascendence.api.models import Matches

@require_http_methods(['GET'])
@authorize
def get_matches_for_user(request: HttpRequest, username: str):
    matches = Matches.objects.filter()
    