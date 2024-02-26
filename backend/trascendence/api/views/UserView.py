
import json
from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponseNotFound, JsonResponse
from backend.trascendence.api.models.User import UserModel


def create_user_list(users: list[UserModel]) -> dict:
    response = dict()
    response["length"] = len(users)
    response["users"] = [{"username": user.username, "avatarURI": user.avatarURI, "name_surname": f"{user.name} {user.surname}"} for user in users]
    return response


@require_http_methods(['GET'])
def search_user(request, username: str):
    user_query = UserModel.objects.filter(username__startswith=username)
    if user_query.exists():
        return JsonResponse(json.dumps(create_user_list([user for user in user_query.values()])), status=200)
    return HttpResponseNotFound(json.dumps({"message": f"no match for keyword {username}"}))