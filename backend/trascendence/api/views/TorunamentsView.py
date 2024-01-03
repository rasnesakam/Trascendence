from django.views.decorators.http import require_http_methods
from trascendence.middleware.auth import authorize
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseServerError


@require_http_methods(['GET'])
@authorize
def get_tournament_invitations(request: HttpRequest) -> JsonResponse:
    pass


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
def get_tournaments(request: HttpRequest) -> JsonResponse:
    pass


@require_http_methods(['GET'])
@authorize
def get_tournament_matches(request: HttpRequest, tournamentcode: str) -> JsonResponse | HttpResponseNotFound:
    pass


@require_http_methods(['POST'])
@authorize
def tournament_create(request: HttpRequest) -> JsonResponse:
    pass


@require_http_methods(['DELETE'])
@authorize
def remove_tournament_user(request: HttpRequest, tournament: str, username: str) -> JsonResponse | HttpResponseNotFound:
    pass