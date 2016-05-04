import jwt

from functools import wraps
from flask import request, g
from lib import errors
from models import user
from app import app

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if ('Authorization' not in request.headers) or (len(request.headers['Authorization']) == 0):
            raise errors.AppException(errors.AUTH_REQUIRED)

        bearer = jwt.decode(request.headers['Authorization'].encode('utf-8'), app.config["TOKEN_SECRET"], algorithm='HS256')
        g.user = user.find_user_by_id(bearer["user_id"])
        if g.user is None:
            raise errors.AppException(errors.AUTH_REQUIRED)
        return f(*args, **kwargs)
    return decorated_function
