from . import blueprint
from flask import request, jsonify
from app.db.validation import is_valid_user
from app.exceptions.invalid_user_exception import InvalidUserException
from flask_jwt_extended import create_access_token


@blueprint.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    try:
        if not is_valid_user(username, password):
            print(InvalidUserException)
            raise InvalidUserException(username)

        access_token = create_access_token(identity=username)

        return jsonify({"access_token": access_token}, 200)
    except InvalidUserException:
        return jsonify({"error": {
            "msg": "The username or password is invalid"
        }}, 401)


