from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response


@api_view(['GET'])
@authentication_classes([BasicAuthentication])
def hi(request):
    return Response({"message": "Hello World"})
