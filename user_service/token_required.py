from flask import request, jsonify
import jwt
from functools import wraps
import os


SECRET_KEY = os.environ.get('SECRET_KEY')
REFRESH_SECRET = os.environ.get('REFRESH_SECRET')

def token_required(f):
    '''Decodes JWT token and passes user id and user name to next function.'''
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token or not token.startswith("Bearer "): 
            return jsonify({"message": "No token provided."}), 401

        token = token.split(" ")[1]

        try: 
            payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
            user_id = payload["user_id"]
            name = payload["name"]
        
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token."}), 401
        
        return f(user_id, name, *args, **kwargs)

    return decorated

def decode_token(token, is_refresh=False):
    key = REFRESH_SECRET if is_refresh else SECRET_KEY
    return jwt.decode(token, key, algorithms="HS256")