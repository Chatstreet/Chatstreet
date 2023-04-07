import os
import sys

from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

from app.config.config import Config
from app.types import KeyType


class Encryption:

    fernet_key: Fernet

    def __init__(self):
        self.fernet_key = Fernet(bytes(Config.BINARY_FERNET_KEY, "utf-8"))

    def encrypt(self, string: str) -> str:
        return self.fernet_key.encrypt(bytes(string, encoding='UTF-8')).decode(encoding='UTF-8')

    def decrypt(self, string: str) -> str:
        print(string)
        # print(bytes_key)
        return self.fernet_key.decrypt(bytes(string, encoding='UTF-8')).decode(encoding='UTF-8')

    @staticmethod
    def genKey() -> KeyType:
        key = rsa.generate_private_key(
            backend=default_backend(),
            public_exponent=65537,
            key_size=2048
        )

        private_key = key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption()
        )

        public_key = key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.PKCS1
        )
        private_key_string: str = private_key.decode(encoding='UTF-8')
        public_key_string: str = public_key.decode(encoding='UTF-8')

        return KeyType(private_key_string, public_key_string)
