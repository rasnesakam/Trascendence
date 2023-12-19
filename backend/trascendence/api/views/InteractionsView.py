from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse


@require_http_methods(['GET'])
def get_friends(request: HttpRequest) -> JsonResponse:
    pass


def add_friend(request: HttpRequest) -> JsonResponse:
    pass


def delete_friend(request: HttpRequest) -> JsonResponse:
    pass


def get_invitations(request: HttpRequest) -> JsonResponse:
    pass


def accept_invitation(request: HttpRequest) -> JsonResponse:
    pass


def decline_invitation(request: HttpRequest) -> JsonResponse:
    pass


def get_blacklist(request: HttpRequest) -> JsonResponse:
    pass


def add_blacklist(request: HttpRequest) -> JsonResponse:
    pass


def remove_blacklist(request: HttpRequest) -> JsonResponse:
    pass

