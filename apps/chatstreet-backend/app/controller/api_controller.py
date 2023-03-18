from flask import jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

BASE_ROUTE: str = "/api/"
api_controller = Blueprint('api', __name__)


@api_controller.route(BASE_ROUTE + 'hello', methods=['GET'])
@jwt_required()
def hello_world():
    user = get_jwt_identity()
    return jsonify(f"Hello World: {user}", 200)
