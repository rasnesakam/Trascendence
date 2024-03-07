from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseServerError, HttpResponseForbidden
from trascendence.api.models import UserModel
from trascendence.middleware.auth import authorize
from trascendence.middleware.validators import request_body, str_field
from trascendence.api.models.InteractionModels import Friends, FriendInvitation, BlackList
from trascendence.api.dto import user_dto, friend_dto, friend_invitation_dto, blacklist_dto
from django.db.models import Q
import json

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
@authorize
def get_friends(request: HttpRequest) -> JsonResponse | HttpResponseNotFound:
    user = request.auth_info.user
    friends = UserModel.objects.filter(
        Q(friends_user_pair_1__user_pair_2=user.id) | 
        Q(friends_user_pair_2__user_pair_1=user.id)
    )
    response = {
        "length": len(friends),
        "content": [user_dto(friend) for friend in friends]
    }
    return JsonResponse(response, status=200)
    

@require_http_methods(['POST'])
@authorize
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=True),
        "message": str_field(max_length=400)
    }
)
def add_friend(request: HttpRequest, content: dict) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    target_username = content.get("username")
    invitation_message = content.get("message", "")
    user = request.auth_info.user
    target = UserModel.objects.get(username=target_username)
    if target is None:
        return HttpResponseNotFound(json.dumps({"message": "User not found"}), content_type="application/json")
    friend_invitation = FriendInvitation.objects.create(origin_id=user.id, target_id=target.id, note=invitation_message)
    if friend_invitation is None:
        return HttpResponseServerError(json.dumps({"message": "Invitation couldn't saved"}), content_type="application/json")
    return JsonResponse({"message": "Invitation sent"}, status=201)
    
    
@require_http_methods(['DELETE'])
@authorize
def delete_friend(request: HttpRequest, user) -> JsonResponse | HttpResponseNotFound:
    user = request.auth_info.user
    try:
        old_friend = UserModel.objects.get(username=user)
        records = Friends.objects.filter(
            (Q(user_pair_1=old_friend) & Q(user_pair_2=user)) | 
            (Q(user_pair_1=user) & Q(user_pair_2=old_friend))
        )
        result = records.delete()
        return JsonResponse({"message": "Friend deleted successfully"}, status=200)
    except UserModel.DoesNotExist:
        return HttpResponseNotFound(json.dumps({"message": "User not found"}), content_type="application/json")    
    

@require_http_methods(['GET'])
@authorize
def get_invitations(request: HttpRequest) -> JsonResponse | HttpResponseNotFound:
    user = request.auth_info.user
    invitations = FriendInvitation.objects.filter(target=user)
    response = {
        "length": len(invitations),
        "content": [friend_invitation_dto(invitation) for invitation in invitations]
    }
    return JsonResponse(response, status=200)
   

@require_http_methods(['POST'])
@authorize
def accept_invitation(request: HttpRequest, invite_code) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    user = request.auth_info.user
    try:
        invitation = FriendInvitation.objects.get(invite_code=invite_code)
        try:
            Friends.objects.create(user_pair_1=invitation.origin, user_pair_2=user)
        except Exception as error:
            return HttpResponseServerError(json.dumps({"message": str(error)}), content_type="application/json")
        invitation.delete()
        return JsonResponse({"message": f"You are now friends with {invitation.origin.username}"})
    except FriendInvitation.DoesNotExist:
        return HttpResponseNotFound(json.dumps({"message": "Invitation not found"}), content_type="application/json")
    

@require_http_methods(['POST'])
@authorize
def decline_invitation(request: HttpRequest, invite_code) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    user = request.auth_info.user
    try:
        invitation = FriendInvitation.objects.get(invite_code=invite_code, target=user)
        invitation.delete()
        return JsonResponse({"message": "Invitation deleted"}, status=200)
    except FriendInvitation.DoesNotExist:
        return HttpResponseNotFound(json.dumps({"message": "Invitation not found"}), content_type="application/json")
    

@require_http_methods(['GET'])
@authorize
def get_blacklist(request: HttpRequest) -> JsonResponse | HttpResponseNotFound:
    user = request.auth_info.user
    blacklists = UserModel.objects.filter(blacklist_user__issuer__id__exact=user.id)
    response = {
        "length": len(blacklists),
        "content": [blacklist_dto(blacklist) for blacklist in blacklists]
    }
    return JsonResponse(response, status=200)
    
@require_http_methods(['POST'])
@authorize
@request_body(
    content_type="application/json",
    fields={
        "username": str_field(required=True, max_length=8)
    }
)
def add_blacklist(request: HttpRequest, content) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    user = request.auth_info.user
    try:
        target = UserModel.objects.get(username=content["username"])
        try:
            BlackList.objects.create(issuer=user, user=target)
            return JsonResponse({"message": "User added to blacklist"}, status=201)
        except Exception as error:
            return HttpResponseServerError(json.dumps({"message": str(error)}), content_type="application/json")
    except UserModel.DoesNotExist:
        return HttpResponseNotFound(json.dumps({"message": "User not found"}), content_type="application/json")
    

@require_http_methods(['DELETE'])
@authorize
def remove_blacklist(request: HttpRequest, target_username) -> JsonResponse | HttpResponseNotFound | HttpResponseServerError:
    issuer_user = request.auth_info.user
    try:
        target_user = UserModel.objects.get(username=target_username)
        blacklisted = BlackList.objects.filter(issuer=issuer_user, user=target_user)
        if blacklisted.exists():
            
            blacklisted.delete()
            return JsonResponse({"message": "User removed from blacklist"}, status=201)
        return HttpResponseNotFound(json.dumps({"message": "User not found"}), content_type="application/json")
    except UserModel.DoesNotExist:
        return HttpResponseNotFound(json.dumps({"message": "User not found"}), content_type="application/json")
    