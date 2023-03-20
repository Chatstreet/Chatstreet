import os
from dotenv import load_dotenv

load_dotenv()


class Config(object):
    ENV: str
    TESTING: bool
    # CSRF_ENABLED = True
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI: str
    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION = ['headers', 'cookies']


class ProductionConfig(Config):
    ENV = "production"
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://' \
                              f'{os.environ.get("PROD_DATABASE_USERNAME")}:' \
                              f'{os.environ.get("PROD_DATABASE_PASSWORD")}@' \
                              f'{os.environ.get("PROD_DATABASE_HOST")}:' \
                              f'{os.environ.get("PROD_DATABASE_PORT")}/' \
                              f'{os.environ.get("PROD_DATABASE_NAME")}'
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class LocalConfig(Config):
    ENV = "local"
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://' \
                              f'{os.environ.get("LOCAL_DATABASE_USERNAME")}:' \
                              f'{os.environ.get("LOCAL_DATABASE_PASSWORD")}@' \
                              f'{os.environ.get("LOCAL_DATABASE_HOST")}:' \
                              f'{os.environ.get("LOCAL_DATABASE_PORT")}/' \
                              f'{os.environ.get("LOCAL_DATABASE_NAME")}'
    TESTING = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class DevelopmentConfig(Config):
    ENV = "development"
    TESTING = False
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://' \
                              f'{os.environ.get("DEV_DATABASE_USERNAME")}:' \
                              f'{os.environ.get("DEV_DATABASE_PASSWORD")}@' \
                              f'{os.environ.get("DEV_DATABASE_HOST")}:' \
                              f'{os.environ.get("DEV_DATABASE_PORT")}/' \
                              f'{os.environ.get("DEV_DATABASE_NAME")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
