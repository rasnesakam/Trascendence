from django.http import HttpRequest, HttpResponse, HttpResponseNotFound, JsonResponse,  HttpResponseBadRequest, \
    HttpResponseForbidden
from django.views.decorators.http import require_http_methods
from trascendence.middleware.auth import authorize
import requests
import json
from trascendence.api.models.User import UserModel
from ..api_42 import get_42_token
from trascendence.core.token_manager import generate_token
from ..serializers import serialize_json
from ...middleware.validators import request_body, str_field, number_field
from trascendence.api.api_42 import get_user_info
from django.contrib.auth.hashers import BCryptPasswordHasher
from trascendence.api.dto import auth_dto

@require_http_methods(['POST'])
@authorize
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=True),
        "password": str_field(required=True)
    }
)
def sign_in(request: HttpRequest, content: dict) -> HttpResponse:
    query = UserModel.objects.filter(username=content['username'])
    if not query.exists():
        return HttpResponseNotFound(json.dumps({'message': 'user not found'}), content_type="application/json")
    user = query.first()
    hasher = BCryptPasswordHasher()
    if hasher.verify(content.get('password'), user.password):
        token = generate_token({'sub': user.username})
        return JsonResponse(auth_dto(user, token), status=200)
    return HttpResponseForbidden(json.dumps({'message': 'Invalid credentials.'}), content_type='application.json')


@require_http_methods(['POST'])
@request_body(
    content_type="application/json",
    fields={
        "code": str_field(required=True)
    }
)
def sign_in_42(request: HttpRequest, content: dict) -> JsonResponse:
    code = content["code"]
    response = get_42_token(code)
    if response["ok"]:
        created_new = False
        token = response["content"]["access_token"]
        info_response = get_user_info(token)
        user_42 = info_response["content"]
        user_db_query = UserModel.objects.filter(intraId=user_42["id"])
        if user_db_query.exists():
            user_db = user_db_query.first()
        else:
            user_db = UserModel.objects.create(
                intraId=user_42["id"],
                name=user_42["first_name"],
                surname=user_42["last_name"],
                username=user_42["login"],
                email=user_42["email"],
                avatarURI=user_42["image"]["link"],
                intra_login=True
            )
            created_new = True
        token = generate_token({"sub": user_db.username})
        return JsonResponse(auth_dto(user_db, token), status=201 if created_new else 200)
    return HttpResponseForbidden(json.dumps({"message": "code is invalid", "response": response}), content_type='application/json')


@require_http_methods(['POST'])
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(min_length=9, required=True),
        "email": str_field(required=True, max_length=50),
        "password": str_field(required=True)
    }
)
@authorize
def sign_up(request: HttpRequest, content: dict) -> HttpResponse:
    """
    Authorize: Bearer <token>
    {
        intraId: "string",
        userName: "string",
        email: "string",
        avatarURI: "string"
    }

    200: Ok
    401: Not authorized
    403: bad request. invalid inputs
    """
    usernamecheck = UserModel.objects.filter(username__exact=content.get("username"))
    if usernamecheck.exists():
        return HttpResponseBadRequest(json.dumps({"message": "Username has already taken."}), content_type="application/json")
    password_hasher = BCryptPasswordHasher()
    #encoded_password = password_hasher.encode()
    user = UserModel.objects.create(
        username=content['username'],
        email=content['email'],
        avatarURI="default.jpeg"
    )
    token = generate_token({"sub": user.username})
    return JsonResponse(auth_dto(user, token), status=201)


@require_http_methods(['POST'])
@authorize
def sign_out(request: HttpRequest) -> HttpResponse:
    return JsonResponse({"message": "Not Supported Yet."}, status=500)


@require_http_methods(['GET'])
@authorize
def verify_token(request):
    try:
        user = UserModel.objects.get(username=request.auth_info["sub"])
        return JsonResponse(json.dumps(auth_dto(user)), status=200)
    except UserModel.DoesNotExist:
        return HttpResponseForbidden()
