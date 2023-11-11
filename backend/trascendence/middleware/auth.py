from urllib.request import Request

import jose.exceptions
from jose import jwt
from rest_framework.response import Response
from django.conf import settings

def authorize(get_response):
    def middleware(request: Request):
        if "Authorization" not in request.headers:
            return Response(
                {"message": "Token must be provide in Authorization header"},
                status=401)
        header_auth_params = request.headers["Authorization"].split()
        auth_type = header_auth_params[0]
        token = header_auth_params[1]
        if auth_type != "Bearer":
            return Response(
                {"message": "Authorization header should be Bearer."},
                status=401)
        try:
            print(settings.SECRET_KEY)
            decoded = jwt.decode(token, settings.SECRET_KEY, options={"verify_signature": True})
            response = get_response(request)
            return response
        except jose.exceptions.JWTError as error:
            return Response(
                {"message": "Token is unauthorized. Try different token"},
                status=401)
    return middleware
