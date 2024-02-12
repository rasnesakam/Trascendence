from rest_framework import serializers
from .models.User import UserModel
from .models.SerializableModel import SerializableModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["id", "created_at", "updated_at", "username", "email", "name", "surname", "uid"]


class LoginSerializer(serializers.ModelSerializer):
    access_token = serializers.CharField


def serialize_json(model: SerializableModel):
    return model.to_json()
