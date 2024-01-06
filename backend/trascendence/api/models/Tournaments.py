import django.utils.timezone
from django.db import models
from .SerializableModel import SerializableModel
from .User import UserModel
import uuid
from django.core.validators import MaxValueValidator, MinValueValidator


class Tournaments(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    tournament_name = models.CharField(max_length=50)
    created_user = models.ForeignKey(UserModel, related_name="%(class)s_created_user", on_delete=models.CASCADE)
    starts_on = models.DateTimeField
    players_capacity = models.IntegerField(max_length=8, default=8, validators=[
        MaxValueValidator(8),
        MinValueValidator(4)
    ])


class TournamentPlayers(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    user = models.ForeignKey(UserModel, related_name="%(class)s_user", on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournaments, related_name="%(class)s_tournament_id", on_delete=models.CASCADE)
    accepted = models.BooleanField


class TournamentInvitations(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    target_user = models.ForeignKey(UserModel, related_name="%(class)s_target_user", on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournaments, related_name="%(class)s_tournament_id", on_delete=models.CASCADE)
    message = models.CharField(max_length=400)

