import os


class Config(object):
    ENV: str
    TESTING: bool
    SQLALCHEMY_DATABASE_URI: str = os.environ.get("DATABASE_URL")
    # jwt
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = False  # own security implementation
    JWT_ACCESS_COOKIE_PATH = "/api/"
    JWT_REFRESH_COOKIE_PATH = "/token/refresh"
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY")


class ProductionConfig(Config):
    ENV = "production"
    TESTING = False


class TestingConfig(Config):
    ENV = "testing"
    TESTING = True


class DevelopmentConfig(Config):
    ENV = "development"
    TESTING = False
    HOST_PORT = 7331
