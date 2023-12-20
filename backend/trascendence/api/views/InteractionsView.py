from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse

from trascendence.middleware.auth import authorize
from trascendence.middleware.validators import request_body, str_field


@require_http_methods(['GET'])
@authorize
def get_friends(request: HttpRequest, username) -> JsonResponse:
    pass


@require_http_methods(['POST'])
@authorize
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=True, max_length=8)
    }
)
def add_friend(request: HttpRequest, username, content) -> JsonResponse:
    pass


@require_http_methods(['DELETE'])
@authorize
def delete_friend(request: HttpRequest, username, user) -> JsonResponse:
    pass


@require_http_methods(['GET'])
@authorize
def get_invitations(request: HttpRequest, username) -> JsonResponse:
    pass


@require_http_methods(['POST'])
@authorize
def accept_invitation(request: HttpRequest, username, invite_code) -> JsonResponse:
    pass


@require_http_methods(['POST'])
@authorize
def decline_invitation(request: HttpRequest, username, invite_code) -> JsonResponse:
    pass


@require_http_methods(['GET'])
@authorize
def get_blacklist(request: HttpRequest, username) -> JsonResponse:
    pass


@require_http_methods(['POST'])
@authorize
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=True, max_length=8)
    }
)
def add_blacklist(request: HttpRequest, username, content) -> JsonResponse:
    pass


@require_http_methods(['DELETE'])
@authorize
def remove_blacklist(request: HttpRequest, username, user) -> JsonResponse:
    pass

