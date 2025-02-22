from flask import request, jsonify
import jwt
from functools import wraps
import os


SECRET_KEY = os.environ.get('SECRET_KEY')

def token_required(f):
    '''Decodes JWT token and passes some user data to next function.'''
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token or not token.startswith("Bearer "): 
            return jsonify({"message": "No token provided."}), 401

        token = token.split(" ")[1]

        try: 
            payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
            user_id = payload["user_id"]
            email = payload["email"]
            name = payload["name"]
        
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token."}), 401
        
        return f(user_id, email, name, *args, **kwargs)

    return decorated
