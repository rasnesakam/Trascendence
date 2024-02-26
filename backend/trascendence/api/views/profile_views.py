
import json
from django.views.decorators.http import require_http_methods
from django.http import HttpRequest, HttpResponseNotFound, JsonResponse
from trascendence.api.models.tournament_models import Tournaments
from trascendence.api.models.User import UserModel
from trascendence.api.models.match_models import Matches
from trascendence.api.models.tournament_models import TournamentMatches


def create_profile_view(user: UserModel, matches: list, tournament_matches: list, tournaments: list) ->dict:
    response = dict()
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
    return response


@require_http_methods(['GET'])
def get_user_profile(request: HttpRequest, username: str):
    try:
        user = UserModel.objects.get(username=username)
        matches = Matches.objects.filter(home=user).values() | Matches.objects.filter(away=user).values()
        tournament_matches = TournamentMatches.objects.filter(match__home__exact=user.id).values() | TournamentMatches.objects.filter(match__away__exact=user.id)
        tournaments = Tournaments.objects.filter(tournamentplayers_tournament_id__user=user.id)
        profile = create_profile_view(
            user,
            [match for match in matches],
            [match for match in tournament_matches],
            [tournament for tournament in tournaments]
        )
        return JsonResponse(profile, status=200)
    except:
        return HttpResponseNotFound(json.dumps({"message":f"user {username} not found"}), content_type="application/json")