from django.http import HttpRequest, JsonResponse
from django.http import HttpResponse
from trascendence.api.models.User import UserModel
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
            token_info = validate_token(token)
            try:
                user = UserModel.objects.get(id=token_info['sub'])
                auth_info = object()
                setattr(auth_info, "token_info", token_info)
                setattr(auth_info, "user", user)
                setattr(auth_info, "token", token)
                setattr(request, "auth_info", auth_info)
                return request_view(request, *args, **kwargs)
            except UserModel.DoesNotExist:
                return JsonResponse({"message": "No such user associated with this token."}, status=401)
        except Exception as e:
            return JsonResponse({"message": f"Token couldn't verified. Reason is: {str(e)}"}, status=401)

    return middleware
