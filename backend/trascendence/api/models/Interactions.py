import random
import string
import uuid

import django.utils.timezone
from .SerializableModel import SerializableModel
from django.db import models
from .User import UserModel


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


class Friends(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    user_pair_1 = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    user_pair_2 = models.ForeignKey(UserModel, on_delete=models.CASCADE)


class FriendInvitation(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    origin = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    target = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    invite_code = models.CharField(max_length=6, default=id_generator)
    note = models.CharField(max_length=400)


class BlackList(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    issuer = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)

