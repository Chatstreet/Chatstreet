from flask import request, jsonify, Blueprint

from app.db.methods import isValidUser, register_response
from app.db.methods import registerUser
from app.exceptions.InvalidUserException import InvalidUserException

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


@token_controller.route(BASE_ROUTE + 'register', methods=['POST'])
def register():
    params: dict = {
        "first_name": request.json.get('first_name', None),
        "last_name": request.json.get('last_name', None),
        "email": request.json.get('email', None),
        "username": request.json.get('username', None),
        "password": request.json.get('password', None),
        "description": 'Hey there I\'m using ChatStreet'
    }
    unset_params: dict = dict(filter(lambda param: param[1] is None, params.items()))
    register_result: register_response = registerUser(params['first_name'], params['last_name'], params['password'], params['email'], params['username'], params['description'])

    if len(unset_params) > 0:
        msg = jsonify({
            "register": False,
            "unset_params": unset_params,
            "msg": "Some mandatory payload was missing, see unset_params."
        }, 401)

    elif register_result["success"]:
        msg = jsonify({
            "register": True,
            "user_tag": register_result['user_tag']
        }, 200)

    else:
        print(register_result)
        msg = jsonify({
            "register": False,
            "msg": "The user already exists."
        }, 401)

    return msg


@token_controller.route(BASE_ROUTE + 'auth', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    user_tag = request.json.get('user_tag', None)
    try:
        if not isValidUser(username, user_tag, password):
            raise InvalidUserException(username)

        access_token = create_access_token(identity=f'{username}#{user_tag}')
        refresh_token = create_refresh_token(identity=f'{username}#{user_tag}')
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
