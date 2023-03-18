from flask import request, jsonify, Blueprint
from app.db.validation import is_valid_user
from app.exceptions.invalid_user_exception import InvalidUserException

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies
)

BASE_ROUTE: str = "/token/"
token_controller = Blueprint('token', __name__)


@token_controller.route(BASE_ROUTE + 'auth', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    try:
        if not is_valid_user(username, password):
            print(InvalidUserException)  # TODO: Outsource to logger
            raise InvalidUserException(username)

        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        response = jsonify({
            "login": True
        }, 200)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response

    except InvalidUserException:
        return jsonify({
            "login": False,
            "error": {
                "msg": "The username or password is invalid"
            }
        }, 401)


@token_controller.route(BASE_ROUTE + 'refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user = get_jwt_identity()
    access_token = create_access_token(identity=user)
    response = jsonify({
        "refresh": True
    }, 200)
    set_access_cookies(response, access_token)
    return response


@token_controller.route(BASE_ROUTE + 'remove', methods=['POST'])
def logout():
    response = jsonify({
        "logout": True
    }, 200)
    unset_jwt_cookies(response)
    return response
