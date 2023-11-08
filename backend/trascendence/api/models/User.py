from trascendence.api.models import BaseModel
from django.db import models

class UserModel(BaseModel.BaseModel):
    username = models.CharField(max_length=50)
    email = models.CharField(max_length=50)