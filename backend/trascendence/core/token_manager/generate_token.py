
from datetime import timedelta, datetime
import jwt
import uuid
from .definitions import ISSUER, SECRET, ALGORITHM


def generate_token(extended_payload: dict, expiration_time = timedelta(minutes=10)) -> str:
    payload = {
        "jti": str(uuid.uuid4()),
        "iss": ISSUER,
        "iat": datetime.now(),
		"nbf": datetime.now(),
        "exp": int((datetime.now() + expiration_time).timestamp())
    }
    payload.update(extended_payload)
    encoded_jwt = jwt.encode(payload, SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def generate_access_token(user):
    return generate_token({"sub": str(user.id), "typ":"access"})


def generate_refresh_token(user):
    return generate_token({"sub": str(user.id), "typ": "refresh"}, timedelta(minutes=45))