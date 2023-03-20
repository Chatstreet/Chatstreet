from flask import jsonify, Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

BASE_ROUTE: str = "/api/"
api_controller = Blueprint('api', __name__)


@api_controller.route(BASE_ROUTE + 'hello', methods=['GET'])
@jwt_required()
def hello_world():
    user = get_jwt_identity()
    print(user)
    return jsonify(f"Hello World: {user}", 200)


@api_controller.route('/user/data', methods=['GET', 'POST'])
@jwt_required()
def user_data():
    user = get_jwt_identity()
    match request.method:
        case 'POST':
            # POST to update user data
            pass
        case 'GET':
            # GET to retrieve user data
            pass
        case _:
            return jsonify({
                "msg": f"Bad request '{request.method}' is not allowed here."
            }, 400)


@api_controller.route('/user/chat', methods=['GET', 'POST'])
@jwt_required()
def user_chat():
    # POST to send a message
    # GET to retrieve the messages
    return jsonify({})


@api_controller.route('/user/invite', methods=['GET', 'POST'])
@jwt_required()
def user_invite():
    # POST to send new invite
    # GET retrieve invite data
    return jsonify({})


@api_controller.route('/user/invite/respond', methods=['POST'])
@jwt_required()
def user_invite_respond():
    # either accept or decline
    return jsonify({})


@api_controller.route('/user/block', methods=['POST'])
@jwt_required()
def user_block():
    # block a user
    return jsonify({})
