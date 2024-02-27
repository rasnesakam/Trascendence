from django.http import HttpRequest, JsonResponse
from django.http import HttpResponse

from trascendence.core import validate_token


def get_token(request: HttpRequest) -> str | None:
    authorization: str | None = request.headers.get("Authorization")
    if authorization is None:
        return None
    if not authorization.startswith("Bearer "):
        return None
    return authorization[len("Bearer "):]


def authorize(request_view):
    def middleware(request: HttpRequest, *args, **kwargs):
        token = get_token(request)
        if token is None:
            return JsonResponse({"message": "this content is not allowed"}, status=401)
        try:
            print(f">{token}<")
            auth_info = validate_token(token)
            setattr(request, "auth_info", auth_info)
            return request_view(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": f"Token couldn't verified. Reason is: {str(e)}"}, status=401)

    return middleware
