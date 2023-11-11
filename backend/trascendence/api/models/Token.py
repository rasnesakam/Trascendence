from trascendence.api.models import BaseModel
from django.db import models
from .User import UserModel

class Token(BaseModel.BaseModel):
    token = models.CharField()
    user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE)