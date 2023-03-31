from flask import request, jsonify, Blueprint

from app.db.methods import is_valid_user, register_response, verify_account, send_password_reset_code, reset_password
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

from app.mail.methods import send_verification_mail
from app.types import UserType

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
        send_verification_mail(params['email'], register_result["verification_code"])
        msg = jsonify({
            "register": True,
            "user_tag": register_result['user_tag']
        }, 200)

    else:
        msg = jsonify({
            "register": False,
            "msg": register_result["msg"]
        }, 401)

    return msg


@token_controller.route(BASE_ROUTE + 'auth', methods=['POST'])
def login():
    user = UserType(request.json.get('username', None), request.json.get('user_tag', None))
    password = request.json.get('password', None)
    try:
        if not is_valid_user(user, password):
            raise InvalidUserException(user.username)

        access_token = create_access_token(identity=f'{user.username}#{user.tag}')
        refresh_token = create_refresh_token(identity=f'{user.username}#{user.tag}')
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
                "msg": "The username or password is invalid or you haven't verified your email address yet"
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


@token_controller.route('/account/verification', methods=['POST'])
def account_verification():
    code: str = request.json.get('code', None)
    result: bool = False
    if code is not None:
        result = verify_account(code)
    if not result:
        return jsonify({
            "verification": False,
            "msg": "The account verification code is invalid"
        }, 400)
    return jsonify({
            "verification": True,
        }, 200)


@token_controller.route('/account/reset/code', methods=['POST'])
def account_reset_password_code():
    username: str = request.json.get('username', None)
    user_tag: str = request.json.get('user_tag', None)
    if username is None or user_tag is None:
        return jsonify({
            "reset_request": False,
            "msg": "A username and user_tag need to be provided"
        }, 400)
    user: UserType = UserType(username, user_tag)
    result: bool = send_password_reset_code(user)
    if not result:
        return jsonify({
            "reset_request": False,
            "msg": f"The user '{user.user}' doesn't exist. Try to register first"
        }, 400)
    return jsonify({
        "reset_request": True
    }, 200)


@token_controller.route('/account/reset/password', methods=['POST'])
def account_reset_password():
    code: str = request.json.get('code', None)
    new_password: str = request.json.get('password', None)
    if code is None or new_password is None:
        return jsonify({
            "reset_password": False,
            "msg": "A code and a new password need to be provided"
        })
    result: bool = reset_password(code, new_password)
    if not result:
        return jsonify({
            "reset_password": False,
            "msg": "The reset code is invalid"
        }, 400)
    return jsonify({
        "reset_password": True
    }, 200)
