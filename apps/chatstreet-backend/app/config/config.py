import os


class Config(object):
    ENV: str
    TESTING: bool
    # CSRF_ENABLED = True
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI: str = os.environ.get("DATABASE_URL")
    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY")
    # TWITTER_OAUTH_CLIENT_KEY = os.environ.get("TWITTER_OAUTH_CLIENT_KEY")
    # TWITTER_OAUTH_CLIENT_SECRET = os.environ.get("TWITTER_OAUTH_CLIENT_SECRET")
    # SESSION_COOKIE_SECURE = True
    # SESSION_COOKIE_HTTPONLY = True
    # SESSION_COOKIE_SAMESITE = 'None'
    # MAIL_SERVER = 'smtp.gmail.com'
    # MAIL_PORT = 465
    # MAIL_USE_TLS = False
    # MAIL_USE_SSL = True
    # MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    # MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")


class ProductionConfig(Config):
    ENV = "production"
    TESTING = False
    # SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestingConfig(Config):
    ENV = "testing"
    TESTING = True
    # ENV = "development"
    # DEVELOPMENT = True
    # SECRET_KEY = "secret_for_test_environment"
    # OAUTHLIB_INSECURE_TRANSPORT = True
    # SQLALCHEMY_TRACK_MODIFICATIONS = True


class DevelopmentConfig(Config):
    ENV = "development"
    TESTING = False
    HOST_PORT = 7331
    # ENV = "development"
    # DEVELOPMENT = True
    # SECRET_KEY = "secret_for_test_environment"
    # OAUTHLIB_INSECURE_TRANSPORT = True
    # SQLALCHEMY_TRACK_MODIFICATIONS = True
