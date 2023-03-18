import os
import sys

from flask import Flask
from flask_jwt_extended import JWTManager

from app.controller.api_controller import api_controller
from app.controller.token_controller import token_controller
from dotenv import load_dotenv
from app.config import config
from app.enums.EnvironmentEnum import EnvironmentEnum

jwt: JWTManager


def create_app(env: str = 'PROD'):
    global jwt

    load_dotenv()
    # create, register and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.register_blueprint(api_controller)
    app.register_blueprint(token_controller)

    match EnvironmentEnum[env]:
        case EnvironmentEnum.DEV:
            app.config.from_object(config.DevelopmentConfig)
        case EnvironmentEnum.TEST:
            app.config.from_object(config.TestingConfig)
        case EnvironmentEnum.PROD:
            app.config.from_object(config.ProductionConfig)
        case _:
            sys.exit(0)

    jwt = JWTManager(app)
    print(app.config['ENV'])  # TODO: Remove this line.

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app
