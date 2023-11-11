from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.request import Request
from trascendence.middleware.auth import authorize


@api_view(['GET'])
@authorize
def auth(request: Request) -> Response:
    return Response({"token": request.auth})

