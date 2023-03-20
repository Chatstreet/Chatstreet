# int. libraries
import os
import sys
# flask
from flask import Flask
from flask_jwt_extended import JWTManager
# controller
from app.controller.api_controller import api_controller
from app.controller.token_controller import token_controller
# database
from app.db import db
from app.db.entities.User import User
from app.db.entities.UserKey import UserKey
from app.db.entities.UserSetting import UserSetting
from app.db.entities.UserMessage import UserMessage
from app.db.entities.UserContactsLookup import UserContactsLookup
# configuration
from app.config import config
# enumeration
from app.enums.EnvironmentEnum import EnvironmentEnum
from app.enums.EnvironmentEnum import EnvironmentEnum
# exception
from app.exceptions.NoDatabaseConnectionExeption import NoDatabaseConnectionException

jwt: JWTManager


def create_app(env: str):
    global jwt

    app = Flask(__name__, instance_relative_config=True)
    app.register_blueprint(api_controller)
    app.register_blueprint(token_controller)

    environment = EnvironmentEnum[env]
    print(f'environment: {env}')

    match environment:
        case EnvironmentEnum.DEV:
            app.config.from_object(config.DevelopmentConfig)
        case EnvironmentEnum.LOCAL:
            app.config.from_object(config.LocalConfig)
        case EnvironmentEnum.PROD:
            app.config.from_object(config.ProductionConfig)
        case _:
            sys.exit(0)

    print(app.config['SQLALCHEMY_DATABASE_URI'])

    jwt = JWTManager(app)
    db.init_app(app)

    try:
        with app.app_context():
            db.create_all()

    except Exception as exception:
        if environment == EnvironmentEnum.LOCAL:
            raise NoDatabaseConnectionException(
                'Connection to database could not be established! Check your environment file or database server status.')
        else:
            raise exception

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app
