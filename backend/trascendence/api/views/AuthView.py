from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.request import Request
from trascendence.middleware.auth import authorize
from rest_framework.parsers import JSONParser
from rest_framework.decorators import parser_classes

@api_view(['GET'])
@authorize
def auth(request: Request) -> Response:
    return Response({"token": request.auth})


@api_view(['POST'])
@parser_classes([JSONParser])
def sign_in(request: Request) -> Response:
    return Response({"message": request.data['name']})

@api_view(['POST'])
@parser_classes([JSONParser])
@authorize
def sign_out(request: Request) -> Response:
    return Response({"message": request.data['name']}) 
