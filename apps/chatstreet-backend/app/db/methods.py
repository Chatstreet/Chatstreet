from app.db import db
from sqlalchemy import text, CursorResult

from app.db.entities.User import User
from app.db.entities.UserKey import UserKey
from app.db.entities.UserSetting import UserSetting

from app.utils.fuctions import generate_random_token

register_response: dict = {
    "success": bool,
    "user_tag": int
}


def registerUser(first_name: str, last_name: str, password: str, email: str, username: str, description: str) -> register_response:
    try:
        keys: UserKey = UserKey('private_key', 'public_key')
        settings: UserSetting = UserSetting(description)
        user_tag: int = getAvailableUserTag(username)

        db.session.add_all([keys, settings])
        db.session.flush()
        db.session.refresh(keys)
        db.session.refresh(settings)

        user: User = User(keys.id, settings.id, first_name, last_name, password, email, username, user_tag)

        db.session.add(user)
        db.session.commit()

    except Exception as e:
        return {"success": False, "user_tag": 0}
    return {"success": True, "user_tag": user_tag}


def changeEmail():
    pass


def getUsernameTag():
    pass


def getPassword():
    pass


def getTest():
    try:
        result: CursorResult = db.session.execute(text('SELECT user.username as "Benutzername", user_setting.description as "Beschreibung" FROM user INNER JOIN user_setting ON user.user_setting_fk = user_setting.id WHERE user.id = {val}'.format(val=1)))
        return result.first()[0]
    except TypeError:
        return "NULL"


def getAvailableUserTag(username: str):
    retry: bool = True
    ran_tag: int = generate_random_token()
    while retry:
        retry = False
        site = db.session.execute(text('SELECT id FROM user WHERE username = "{username}" AND user_tag = "{user_tag}"'.format(username=username, user_tag=ran_tag))).fetchone()
        if site is not None:
            ran_tag = generate_random_token()
            retry = True
    return ran_tag


def isValidUser(username: str, user_tag: str, password: str) -> bool:
    try:
        site = db.session.execute(text('SELECT password FROM user WHERE username = "{username}" AND user_tag = "{tag}"'.format(username=username, tag=user_tag))).fetchone()
        return site.t.password == password
    except Exception:
        return False

