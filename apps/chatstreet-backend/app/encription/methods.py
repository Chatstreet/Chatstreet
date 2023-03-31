import os

from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

from app.types import KeyType

bytes_key: bytes = bytes(os.environ.get('BINARY_FERNET_KEY'), encoding='UTF-8')
fernet_key: Fernet = Fernet(bytes_key)


def encrypt(string: str) -> str:
    return fernet_key.encrypt(bytes(string, encoding='UTF-8')).decode(encoding='UTF-8')


def decrypt(string: str) -> str:
    print(string)
    print(bytes_key)
    return fernet_key.decrypt(bytes(string, encoding='UTF-8')).decode(encoding='UTF-8')


def genKey() -> KeyType:
    key = rsa.generate_private_key(
        backend=default_backend(),
        public_exponent=65537,
        key_size=2048
    )

    private_key = key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption()
    )

    public_key = key.public_key().public_bytes(
        serialization.Encoding.OpenSSH,
        serialization.PublicFormat.OpenSSH
    )
    private_key_string: str = private_key.decode(encoding='UTF-8')
    public_key_string: str = public_key.decode(encoding='UTF-8')

    return KeyType(private_key_string, public_key_string)
