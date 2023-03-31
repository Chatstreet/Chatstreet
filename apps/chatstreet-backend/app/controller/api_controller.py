import json
import os

from flask import jsonify, Blueprint, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity, set_access_cookies, create_access_token

from app.db import methods
from app.db.methods import invite_user, get_user_contact, are_friends, send_message, parse_invite_response, \
    get_messages_response, get_messages
from app.enums.FriendOrUserEnum import FriendOrUserEnum
from app.enums.InvitationResponseEnum import InvitationResponseEnum
from app.enums.UserContactStatusEnum import UserContactStatusEnum

from app.types import UserType


BASE_ROUTE: str = "/api/"
api_controller = Blueprint('api', __name__)


@api_controller.route(BASE_ROUTE + 'hello', methods=['GET'])
@jwt_required()
def hello_world():
    user = get_jwt_identity()
    print(user)
    return jsonify(f"Hello World: {user}", 200)


@api_controller.route(BASE_ROUTE + '/user/data', methods=['GET', 'POST'])
@jwt_required()
def user_data():
    user = get_jwt_identity()
    match request.method:
        case 'POST':
            result = methods.update_user_data(request.json, UserType.from_user(user))
            if result['success']:
                access_token = create_access_token(identity=result['user'])
                response = jsonify({
                    "update": True,
                    "msg": result['msg']
                }, 200)
                set_access_cookies(response, access_token)
            else:
                response = jsonify({
                    "update": False,
                    "msg": result['msg']
                }, 400)
        case 'GET':
            result = methods.get_user_data(UserType.from_user(user))
            response = jsonify({
                "user": result
            }, 200)
        case _:
            response = jsonify({
                "msg": f"Bad request '{request.method}' is not allowed here."
            }, 400)
    return response


@api_controller.route(BASE_ROUTE + '/user/chat', methods=['GET', 'POST'])
@jwt_required()
def user_chat():
    user = get_jwt_identity()
    match request.method:
        case 'POST':
            # POST to send a message
            friend_username = request.json.get('contact_username', None)
            friend_user_tag = request.json.get('contact_user_tag', None)
            message = request.json.get('message', None)
            if friend_username is None or friend_user_tag is None or message is None:
                response = jsonify({
                    "status": False,
                    "msg": "A contact_username, contact_user_tag and message need to be provided"
                }, 400)
            else:
                user_friend: UserType = UserType(friend_username, friend_user_tag)
                if are_friends(UserType.from_user(user), user_friend):
                    if send_message(UserType.from_user(user), user_friend, message):
                        response = jsonify({
                            "status": True
                        }, 200)
                    else:
                        response = jsonify({
                            "status": False,
                            "msg": "The message couldn't be sent"
                        }, 400)
                else:
                    response = jsonify({
                        "status": False,
                        "msg": f"'{user_friend.user}' couldn't be found in '{user}' friends list"
                    }, 400)
        case 'GET':
            # GET to retrieve the messages
            friend_string: str = request.args.get("friend", None)
            if friend_string is None:
                response = jsonify({
                    "status": False,
                    "msg": "Missing argument 'friend'"
                }, 400)
            else:
                friend: UserType = UserType.from_user(friend_string)
                chat: get_messages_response = get_messages(UserType.from_user(user), friend)
                if chat['status']:
                    response = jsonify({
                        "status": True,
                        "chat": chat
                    }, 200)
                else:
                    response = jsonify({
                        "status": False,
                        "msg": f"'{friend.user}' couldn't be found in '{user}' friends list"
                    }, 400)
        case _:
            response = jsonify({
                "status": False,
                "msg": f"Bad request '{request.method}' is not allowed here."
            }, 400)
    return response


@api_controller.route(BASE_ROUTE + '/user/invites', methods=['GET', 'POST'])
@jwt_required()
def user_invites():
    user: UserType = UserType.from_user(get_jwt_identity())
    match request.method:
        case 'POST':
            invite_username: str = request.json.get('username', None)
            invite_user_tag: str = request.json.get('user_tag', None)
            if invite_username is None or invite_user_tag is None:
                return jsonify({
                    "invite": False,
                    "msg": "A username and user_tag need to be provided"
                }, 400)
            invite: UserType = UserType(invite_username, invite_user_tag)
            result: bool = invite_user(user, invite)
            if not result:
                response = jsonify({
                    "invite": False,
                    "msg": f"The user '{invite.user}' doesn't exist"
                }, 400)
            else:
                response = jsonify({
                    "invite": True
                }, 200)
        case 'GET':
            # retrieve list of users that invited user
            invites: list[UserType] = get_user_contact(user, UserContactStatusEnum.INVITED, FriendOrUserEnum.FRIEND)
            response = jsonify({
                "invites": [invite.to_dict() for invite in invites]
            }, 200)
        case _:
            response = jsonify({
                "msg": f"Bad request '{request.method}' is not allowed here."
            }, 400)
    return response


@api_controller.route(BASE_ROUTE + '/user/invite/respond', methods=['POST'])
@jwt_required()
def user_invite_respond():
    user = get_jwt_identity()
    contact_username: str = request.json.get("contact_username", None)
    contact_user_tag: str = request.json.get("contact_user_tag", None)
    response: InvitationResponseEnum = InvitationResponseEnum.fromString(request.json.get("response", None))
    if contact_username is None or contact_user_tag is None or response is None:
        return jsonify({
            "invite_response": False,
            "msg": "A contact_username, contact_user_tag and response need to be provided"
        }, 400)
    contact: UserType = UserType(contact_username, contact_user_tag)
    if parse_invite_response(UserType.from_user(user), contact, response):
        return jsonify({
            "invite_response": True
        }, 200)
    return jsonify({
        "invite respond": False,
        "msg": f"'{contact.user}' couldn't be found in '{user}' invite list"
    }, 400)


@api_controller.route(BASE_ROUTE + '/user/block', methods=['POST'])
@jwt_required()
def user_block():
    # block a user
    return jsonify({})


@api_controller.route(BASE_ROUTE + '/user/friends', methods=['GET'])
@jwt_required()
def user_friends():
    user: UserType = UserType.from_user(get_jwt_identity())
    friends_a: list[UserType] = get_user_contact(user, UserContactStatusEnum.FRIENDS, FriendOrUserEnum.USER)
    friends_b: list[UserType] = get_user_contact(user, UserContactStatusEnum.FRIENDS, FriendOrUserEnum.FRIEND)
    friends: list[UserType] = friends_a + friends_b
    return jsonify({
        "friends": [friend.to_dict() for friend in friends]
    }, 200)


@api_controller.route(BASE_ROUTE + '/user/invited', methods=['GET'])
@jwt_required()
def user_invited():
    # Retrieves list of users that have been invited by user
    user: UserType = UserType.from_user(get_jwt_identity())
    invited: list[UserType] = get_user_contact(user, UserContactStatusEnum.INVITED, FriendOrUserEnum.USER)
    return jsonify({
        "invited": [invite.to_dict() for invite in invited]
    }, 200)
