import urllib.request
import json
from urllib.error import URLError
from urllib.request import Request
from django.http import HttpRequest
from django.http import HttpResponse


def get_token(request: HttpRequest) -> str | None:
    authorization: str | None = request.headers.get("Authorization")
    if authorization is None:
        return None
    if not authorization.startswith("Bearer "):
        return None
    return authorization[len("Bearer "):]


def authorize(request_view):
    def middleware(request: HttpRequest):
        token = get_token(request)
        if token is None:
            return HttpResponse(json.dumps({"message": "this content is not allowed"}), content_type="application/json",
                                status=401)
        token_verifier_uri = "https://api.intra.42.fr/oauth/token/info"
        token_verifier_headers = {
            "Authorization": f"Bearer {token}"
        }
        token_request = Request(token_verifier_uri, headers=token_verifier_headers, method="GET")
        try:
            response = urllib.request.urlopen(token_request)
            if response.status == 200:
                return request_view(request)
        except URLError as e:
            return HttpResponse(json.dumps({"message": "Token couldn't verified"}), content_type="application/json",
                                status=401)

    return middleware
