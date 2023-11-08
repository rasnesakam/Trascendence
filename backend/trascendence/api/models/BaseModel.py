from django.db import models
from datetime import datetime
import uuid


class BaseModel(models.Model):
    id = models.CharField(max_length=36, default=uuid.uuid4())
    created_at = models.DateTimeField(default=datetime.utcnow())
    updated_at = models.DateTimeField(default=datetime.utcnow())
