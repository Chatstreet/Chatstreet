import os
import sys

from flask import Flask
from flask_jwt_extended import JWTManager

from .controller.chatstreet_controller import blueprint
from dotenv import load_dotenv
from .config import config
from .enums.EnvironmentEnum import EnvironmentEnum


def create_app(env: str = 'PROD'):
    load_dotenv()
    # create, register and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.register_blueprint(blueprint)

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
    print(app.config['ENV'])  # TODO: Remove this line

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app
