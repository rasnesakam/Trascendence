
from datetime import timedelta, datetime
import jwt

from .definitions import ISSUER, SECRET, ALGORITHM


def generate_token(extended_payload: dict, expiration_time = timedelta(minutes=10)) -> str:
    payload = {
        "iss": ISSUER,
        "iat": datetime.now(),
        "exp": int((datetime.now() + expiration_time).timestamp())
    }
    payload.update(extended_payload)
    encoded_jwt = jwt.encode(payload, SECRET, algorithm=ALGORITHM)
    return encoded_jwt
