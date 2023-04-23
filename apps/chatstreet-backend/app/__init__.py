# int. libraries
import os
import sys
# flask
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
# controller
from app.controller.api_controller import api_controller
from app.controller.token_controller import token_controller
# database
from app.db import db
# configuration
from app.config import config
from app.config.config import Config
# enumeration
from app.enums.EnvironmentEnum import EnvironmentEnum
from app.enums.EnvironmentEnum import EnvironmentEnum
# exception
from app.exceptions.NoDatabaseConnectionExeption import NoDatabaseConnectionException

jwt: JWTManager
mail: Mail
conf: Config


def create_app(env: str):
    global jwt, mail, conf

    app = Flask(__name__, instance_relative_config=True)
    app.register_blueprint(api_controller)
    app.register_blueprint(token_controller)

    environment = EnvironmentEnum[env]

    match environment:
        case EnvironmentEnum.DEV:
            conf = config.DevelopmentConfig
        case EnvironmentEnum.LOCAL:
            conf = config.LocalConfig
        case EnvironmentEnum.PROD:
            conf = config.ProductionConfig
        case _:
            sys.exit(0)

    app.config.from_object(conf)
    CORS(app, supports_credentials=True)

    jwt = JWTManager(app)
    mail = Mail(app)
    db.init_app(app)

    try:
        with app.app_context():
            db.create_all()

    except Exception as exception:
        if environment == EnvironmentEnum.LOCAL:
            raise NoDatabaseConnectionException(
                'Connection to database could not be established! Check your environment file or database server '
                'status.')
        else:
            raise exception

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app
