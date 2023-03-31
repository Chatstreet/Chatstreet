from flask import jsonify
from werkzeug import Request

from app.db.methods import update_user_data
from app.types import UserType


# # updates changed user data
# def post_user_data(body: dict, user):
#     attribute_table_map: dict = {
#         "first_name": "user",
#         "last_name": "user",
#         "email": "user",
#         "username": "user",
#         "profile": "user_setting",
#         "description": "user_setting"
#     }
#     set_user_list: list = []
#     set_user_setting_list: list = []
#     for key in body:
#         try:
#             table: str = attribute_table_map[key]
#             command: str = f'{f"{table}.{key}"} = "{body[key]}"'
#             match table:
#                 case 'user':
#                     set_user_list.append(command)
#                 case 'user_setting':
#                     set_user_setting_list.append(command)
#         except KeyError:
#             continue
#     set_user_string = ', '.join(set_user_list)
#     set_user_setting_string = ', '.join(set_user_setting_list)
#     return update_user_data(set_user_string, set_user_setting_string)


# to retrieve user data
def get_user_data(request: Request, user: str):
    return jsonify({})
