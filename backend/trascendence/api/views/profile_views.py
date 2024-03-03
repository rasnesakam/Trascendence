
import json
from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponseNotFound, JsonResponse
from django.db.models import Q
from trascendence.api.models.tournament_models import Tournaments
from trascendence.api.models.User import UserModel
from trascendence.api.models.match_models import Matches
from trascendence.api.models.tournament_models import TournamentMatches


def create_profile_view(user: UserModel, matches: list, tournament_matches: list, tournaments: list) ->dict:
    response = dict()
    response['username'] = user.username
    response['name'] = user.name
    response['surname'] = user.surname
    response['email'] = user.email
    response['avatarURI'] = user.avatarURI
    response['matches'] = {
        "length": len(matches),
        "matches": matches
    }
    response['tournamentMatches'] = {
        "length": len(tournament_matches),
        "matches": tournament_matches
    }
    response["tournaments"] = {
        "length": len(tournaments),
        "tournaments": tournaments
    }
    response['rival'] = "emakas"
    return response


@require_http_methods(['GET'])
def get_user_profile(request: HttpRequest, username: str):
    try:
        user = UserModel.objects.get(Q(username__exact=username))
        matches = Matches.objects.filter(Q(home=user) | Q(away=user))
        tournament_matches = TournamentMatches.objects.filter(Q(match__home__exact=user.id) | Q(match__away__exact=user.id))
        tournaments = Tournaments.objects.filter(tournamentplayers_tournament_id__user=user.id)
        profile = create_profile_view(
            user,
            [match for match in matches],
            [match for match in tournament_matches],
            [tournament for tournament in tournaments]
        )
        return JsonResponse(profile, status=200)
    except Exception as e:
        return HttpResponseNotFound(json.dumps({"message":f"user '{username}' not found", "exception": str(e)}), content_type="application/json")