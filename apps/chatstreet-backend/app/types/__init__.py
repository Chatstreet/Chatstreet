import json


class UserType:
    user: str
    username: str
    tag: str

    @classmethod
    def from_user(cls, user: str):
        username = user.split('#')[0]
        user_tag = user.split('#')[1]
        return UserType(username, user_tag)

    def __init__(self, username: str, user_tag: str):
        self.username = username
        self.tag = user_tag
        self.user = f'{username}#{user_tag}'

    def to_dict(self) -> dict:
        return json.loads(json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4))

    def is_valid(self) -> bool:
        return '#' in self.user


class KeyType:
    private_key: str
    public_key: str

    def __init__(self, private_key: str, public_key: str):
        self.private_key = private_key
        self.public_key = public_key
