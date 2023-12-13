import django.utils.timezone
from django.db import models
from .SerializableModel import SerializableModel
import uuid


class UserModel(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    intraId = models.IntegerField()
    username = models.CharField(max_length=50)
    email = models.CharField(max_length=100)
    avatarURI = models.CharField(max_length=200)


