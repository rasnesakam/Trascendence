import django.utils.timezone
from django.db import models
from .SerializableModel import SerializableModel
from .User import UserModel
from .Tournaments import Tournaments
import uuid


MATCH_WINNERS = (
    ('h', "home"),
    ('a', "away"),
    ('u', "unknown")
)


class Matches(models.Model, SerializableModel):
    id = models.CharField(max_length=36, default=uuid.uuid4, primary_key=True)
    tournament = models.ForeignKey(Tournaments, related_name="%(class)s_tournament_id", on_delete=models.CASCADE, blank=True, null=True)
    home = models.ForeignKey(UserModel, related_name="%(class)s_home", on_delete=models.CASCADE)
    away = models.ForeignKey(UserModel, related_name="%(class)s_away", on_delete=models.CASCADE)
    winner = models.CharField(max_length=1, choices=MATCH_WINNERS, default="u")

