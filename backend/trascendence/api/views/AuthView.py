from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound
from django.views.decorators.http import require_http_methods
from trascendence.middleware.auth import authorize
from trascendence.middleware.content_types import content_json
import requests
from trascendence.api.models.User import UserModel
from ..api_42 import get_42_token
from trascendence.core.token_manager import generate_token
from ..serializers import serialize_json
from ...middleware.validators import request_body, str_field
from trascendence.api.api_42 import get_user_info


@require_http_methods(['POST'])
@authorize
@content_json
def sign_in(request: HttpRequest) -> HttpResponse:
    """
    Authorize: Bearer <token>
    {
        intraId: number
    }

    200: Ok,
    404: Not found
    401: Not authorized
    """
    user = UserModel.objects.filter(intraId=request.content_json['intraId']).first()
    if user is None:
        return HttpResponseNotFound({"message": "user not found"}, content_type="application/json")
    return JsonResponse({"content": serialize_json(user)})


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
    return JsonResponse({"message": "code is invalid"}, status=401)


@require_http_methods(['POST'])
@content_json
@authorize
def sign_up(request: HttpRequest) -> HttpResponse:
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
    """
    user = UserModel.objects.create(
        intraId=request.content_json['intraId'],
        username=request.content_json['username'],
        email=request.content_json['email'],
        avatarURI=request.content_json['avatarURI']
    )
    return JsonResponse({"message:": "User created", "content": serialize_json(user)}, status=201)


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
    response["Location"] = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-93b994991128a715506042b0c6a8460084a51ee7cbd47b81b9acf5c385edb53c&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Ftoken%2Fcode&response_type=code"
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
