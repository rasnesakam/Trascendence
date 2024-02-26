
def create_profile_view(user: UserModel, matches: list) ->dict:
    response = dict()
    response['name']
    response['surname']
    response['email']
    response['avatarURI']
    response['matches'] = {
        "len": 0,
        "matches": []
    }
    response['tournaments'] = {
        "len": 0,
        "matches": []
    }
