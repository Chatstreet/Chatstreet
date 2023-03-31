import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config(object):
    ENV: str
    TESTING: bool
    SQLALCHEMY_DATABASE_URI: str
    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION: list = ['headers', 'cookies']
    JWT_COOKIE_SECURE: str
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(weeks=1)
    MAIL_SERVER: str = os.environ.get("MAIL_SERVER")
    MAIL_PORT: int = os.environ.get("MAIL_PORT")
    MAIL_USERNAME: str = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD: str = os.environ.get("MAIL_PASSWORD")
    MAIL_USE_TLS: bool = False
    MAIL_USE_SSL: bool = True
    MAIL_DEFAULT_SENDER: str = os.environ.get("EMAIL_SENDER")


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
    JWT_COOKIE_SECURE = True  # !Important: Requires HTTPS connection


class LocalConfig(Config):
    ENV = "local"
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://' \
                              f'{os.environ.get("LOCAL_DATABASE_USERNAME")}:' \
                              f'{os.environ.get("LOCAL_DATABASE_PASSWORD")}@' \
                              f'{os.environ.get("LOCAL_DATABASE_HOST")}:' \
                              f'{os.environ.get("LOCAL_DATABASE_PORT")}/' \
                              f'{os.environ.get("LOCAL_DATABASE_NAME")}'
    TESTING = True  # !Important: Prevents emails from being sent
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_COOKIE_SECURE = False


class DevelopmentConfig(Config):
    ENV = "development"
    TESTING = False
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://' \
                              f'{os.environ.get("DEV_DATABASE_USERNAME")}:' \
                              f'{os.environ.get("DEV_DATABASE_PASSWORD")}@' \
                              f'{os.environ.get("DEV_DATABASE_HOST")}:' \
                              f'{os.environ.get("DEV_DATABASE_PORT")}/' \
                              f'{os.environ.get("DEV_DATABASE_NAME")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_COOKIE_SECURE = False
