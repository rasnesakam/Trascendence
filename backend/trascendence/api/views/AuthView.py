from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseBadRequest, \
    HttpResponseForbidden
from django.views.decorators.http import require_http_methods
from trascendence.middleware.auth import authorize
from trascendence.middleware.content_types import content_json
import requests
import json
from trascendence.api.models.User import UserModel
from ..api_42 import get_42_token
from trascendence.core.token_manager import generate_token
from ..serializers import serialize_json
from ...middleware.validators import request_body, str_field, number_field
from trascendence.api.api_42 import get_user_info
from django.contrib.auth.hashers import BCryptPasswordHasher


def create_user_data(usermodel: UserModel, token: str) -> dict:
    userdata = dict()
    userdata['username'] = usermodel.username
    userdata['email'] = usermodel.email
    userdata['avatarURI'] = usermodel.avatarURI
    userdata['token'] = token
    return userdata


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
        return HttpResponseBadRequest(json.dumps({'message': 'user not found'}), content_type="application/json")
    user = query.first()
    hasher = BCryptPasswordHasher()
    if hasher.verify(content.get('password'), user.password):
        token = generate_token({'sub': user.username})
        user_data = create_user_data(user, token)
        return JsonResponse({"content": user_data})
    return HttpResponseForbidden(json.dumps({'message': 'Invalid credentials.'}), content_type='application.json')


@require_http_methods(['POST'])
@request_body(
    content_type="application/json",
    fields={
        "code": str_field(required=True)
    }
)
def sign_in_42(request: HttpRequest, content: dict) -> JsonResponse:
    code = content.get("code")
    response = get_42_token(code)
    print("here")
    if response["ok"]:
        token = response["content"]["access_token"]
        info_response = get_user_info(token)
        user_42 = info_response["content"]
        user_db_query = UserModel.objects.filter(intraId=user_42["id"])
        if user_db_query.exists():
            user_db = user_db_query.first()
        else:
            user_db = UserModel.objects.create(intraId=user_42["id"], username=user_42["login"], email=user_42["email"],
                                               avatarURI=user_42["image"]["link"])
        token = generate_token({"sub": user_db.username})
        user_json = serialize_json(user_db)
        user_json.update({"access_token": token})
        return JsonResponse(user_json, status=201)
    return HttpResponseForbidden({"message": "code is invalid"}, content_type='application/json')


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
    return JsonResponse({"message:": "User created", "content": create_user_data(user)}, status=201)


@require_http_methods(['POST'])
@authorize
def sign_out(request: HttpRequest) -> HttpResponse:
    return JsonResponse({"message": "Not Supported Yet."})


@require_http_methods(['GET'])
def OAuth(request: HttpRequest):
    """
    DEPRECATED: Will be removed
    """
    response = HttpResponse(status=302)
    response[
        "Location"] = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-93b994991128a715506042b0c6a8460084a51ee7cbd47b81b9acf5c385edb53c&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Ftoken%2Fcode&response_type=code"
    return response


@require_http_methods(['GET'])
def token(request):
    """
    DEPRECATED: Will be removed
    """
    client_id = "u-s4t2ud-93b994991128a715506042b0c6a8460084a51ee7cbd47b81b9acf5c385edb53c"
    client_secret = "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"
    redirect_url = "http://localhost:8000/api/auth/token/code"
    code = request.GET.get("code", "undefined")
    if code != "undefined":
        url = "https://api.intra.42.fr/oauth/token"
        data = {
            "grant_type": "authorization_code",
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "redirect_uri": redirect_url
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        res = requests.post(url, data=data, headers=headers)
        print(f"code: {code}")
        print(f"response: {res.text}")
        return JsonResponse({"message": res.json(), "status": res.status_code})
    return JsonResponse({"message": "code not found"}, status=404)
