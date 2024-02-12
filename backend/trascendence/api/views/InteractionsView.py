from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseServerError
from trascendence.api.models import UserModel
from trascendence.middleware.auth import authorize
from trascendence.middleware.validators import request_body, str_field
from trascendence.api.models.InteractionModels import Friends, FriendInvitation, BlackList
from django.views.decorators.csrf import csrf_exempt


""" NOTE:

Definition of complication kwarg for Django orm
===============================================

friends_user_pair_1__user_pair_2__exact
^^^^^^^ ^^^^^^^^^^^  ^^^^^^^^^^^
   |         |            |----> Search param
   |         |-----------------> Join table param ( ON user.id = user_pair_1 )
   |---------------------------> Join table

"""

@require_http_methods(['GET'])
#@authorize
def get_friends(request: HttpRequest, username) -> JsonResponse | HttpResponseNotFound:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")

    friends1 = [friend for friend in UserModel.objects.filter(friends_user_pair_1__user_pair_2__exact=user.id).values()]
    friends2 = [friend for friend in UserModel.objects.filter(friends_user_pair_2__user_pair_1__exact=user.id).values()]
    content = {"content": friends1 + friends2}
    return JsonResponse(content)


@require_http_methods(['POST'])
#@authorize
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=True, max_length=8),
        "message": str_field(max_length=400)
    }
)
def add_friend(request: HttpRequest, username, content: dict) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    target_username = content.get("username")
    invitation_message = content.get("message", "")
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    target = UserModel.objects.get(username=target_username)
    if target is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    friend_invitation = FriendInvitation.objects.create(origin_id=user.id, target_id=target.id, note=invitation_message)
    if friend_invitation is None:
        return HttpResponseServerError(str({"message": "Invitation couldn't saved"}), content_type="application/json")
    return JsonResponse({"message": "Invitation sent"}, status=201)

@require_http_methods(['DELETE'])
#@authorize
def delete_friend(request: HttpRequest, username, user) -> JsonResponse | HttpResponseNotFound:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    old_friend = UserModel.objects.get(username=user)
    if old_friend is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    records = Friends.objects.filter(user_pair_1=old_friend, user_pair_2=user) | Friends.objects.filter(user_pair_1=user, user_pair_2=old_friend)
    result = records.delete()
    if len(result) > 0:
        return JsonResponse({"message": "Friend deleted successfully"}, status=200)


@require_http_methods(['GET'])
#@authorize
def get_invitations(request: HttpRequest, username) -> JsonResponse | HttpResponseNotFound:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    invitations = [invitation for invitation in FriendInvitation.objects.filter(target=user).values()]
    return JsonResponse({"message": "", "content": invitations}, status=200)


@require_http_methods(['POST'])
#@authorize
def accept_invitation(request: HttpRequest, username, invite_code) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    invitation = FriendInvitation.objects.get(invite_code=invite_code)
    if invitation is None:
        return HttpResponseNotFound(str({"message": "Invitation not found"}), content_type="application/json")
    friendship = Friends.objects.create(user_pair_1=invitation.origin, user_pair_2=user)
    if friendship is None:
        return HttpResponseServerError({"message": "Server Error"}, content_type="application/json")
    invitation.delete()
    return JsonResponse({"message": f"You are now friends with {invitation.origin.username}"})


@require_http_methods(['POST'])
#@authorize
def decline_invitation(request: HttpRequest, username, invite_code) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    invitation = FriendInvitation.objects.get(invite_code=invite_code)
    if invitation is None:
        return HttpResponseNotFound(str({"message": "Invitation not found"}), content_type="application/json")
    invitation.delete()
    return JsonResponse({"message": "Invitation deleted"}, status=200)


@require_http_methods(['GET'])
#@authorize
def get_blacklist(request: HttpRequest, username) -> JsonResponse | HttpResponseNotFound:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    print(UserModel.objects.filter(blacklist_user__issuer__id__exact=user.id).query)
    blacklist = [blacklist for blacklist in UserModel.objects.filter(blacklist_user__issuer__id__exact=user.id).values()]

    return JsonResponse({"message": "", "content": blacklist}, status=200)


@require_http_methods(['POST'])
#@authorize
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=True, max_length=8)
    }
)
def add_blacklist(request: HttpRequest, username, content) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    user = UserModel.objects.get(username=username)
    if user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    target = UserModel.objects.get(username=content["username"])
    if target is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    result = BlackList.objects.create(issuer=user, user=target)
    if result is None:
        return HttpResponseServerError(str({"message": "User could not added to blacklist"}), content_type="application/json")
    return JsonResponse({"message": "User added to blacklist"}, status=201)


@require_http_methods(['DELETE'])
#@authorize
def remove_blacklist(request: HttpRequest, issuer_username, target_username) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    issuer_user = UserModel.objects.get(username=issuer_username)
    if issuer_user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    target_user = UserModel.objects.get(username=target_username)
    if target_user is None:
        return HttpResponseNotFound(str({"message": "User not found"}), content_type="application/json")
    result = BlackList.objects.filter(issuer=issuer_user, user=target_user).delete()
    if result is None:
        return HttpResponseServerError(str({"message": "User could not removed from blacklist"}), content_type="application/json")
    return JsonResponse({"message": "User removed from blacklist"}, status=201)

