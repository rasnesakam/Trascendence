from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from trascendence.api.models.User import UserModel
from trascendence.api.serializers import UserSerializer

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request, *args, **kwargs):
        users = UserModel.objects.filter()
        serializer = UserSerializer(users,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
