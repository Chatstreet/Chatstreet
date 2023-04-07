import string
import random

from app.encription.methods import Encryption
from app.enums.FriendOrUserEnum import FriendOrUserEnum
from app.enums.InvitationResponseEnum import InvitationResponseEnum
from app.enums.UserContactStatusEnum import UserContactStatusEnum
from app.mail.methods import send_password_reset_mail
from app.types import UserType, KeyType
from app.db import db

from app.db.entities.User import User
from app.db.entities.UserKey import UserKey
from app.db.entities.UserSetting import UserSetting
from app.db.entities.UserMessage import UserMessage
from app.db.entities.UserContactsLookup import UserContactsLookup

from app.utils.fuctions import generate_random_token

register_response: dict = {
    "success": bool,
    "user_tag": int,
    "verification_code": str,
    "msg": str
}

update_user_data_response: dict = {
    "success": bool,
    "user": str,
    "msg": str
}

get_user_data_response: dict = {
    "username": str,
    "user_tag": int,
    "first_name": str,
    "last_name": str,
    "email": str,
    "description": str,
    "profile": str
}

message_type: dict = {
    "sender_content": str,
    "reciever_content": str,
    "user": str,
    "timestamp": float
}

get_messages_response: dict = {
    "status": bool,
    "messages": [message_type],
    "friend": str,
    "public_key": str
}

encryption: Encryption = Encryption()


def registerUser(first_name: str, last_name: str, password: str, email: str, username: str,
                 description: str) -> register_response:
    if '#' in username:
        return {"success": False, "msg": "The username can't contain the character: '#'"}
    try:
        verification_code: str = generate_code()
        key_pair: KeyType = encryption.genKey()
        salty_private_key: str = encryption.encrypt(key_pair.private_key)
        salty_public_key: str = encryption.encrypt(key_pair.public_key)
        keys: UserKey = UserKey(salty_private_key, salty_public_key)
        settings: UserSetting = UserSetting(description)
        user_tag: int = get_available_user_tag(username)

        db.session.add_all([keys, settings])
        db.session.flush()
        db.session.refresh(keys)
        db.session.refresh(settings)

        user: User = User(keys.id, settings.id, first_name, last_name, password, email, username, user_tag,
                          verification_code)

        db.session.add(user)
        db.session.commit()

    except Exception as e:
        raise e
        return {"success": False, "user_tag": 0, "verification_code": "", "msg": "The user already exists."}
    return {"success": True, "user_tag": user_tag, "verification_code": verification_code}


def update_user_data(body: dict, user: UserType) -> update_user_data_response:
    user_tuple = User.query.filter_by(username=user.username, user_tag=user.tag).first()
    user_setting_tuple = UserSetting.query.filter_by(id=user_tuple.user_setting_fk).first()
    unknown_parameter: list = []
    try:
        for key in body:
            match key:
                case "first_name":
                    user_tuple.first_name = body['first_name']
                case "last_name":
                    user_tuple.last_name = body['last_name']
                case "email":
                    user_tuple.email = body['email']
                case "username":
                    user_tuple.username = body['username']
                case "profile":
                    user_setting_tuple.profile = body['profile']
                case "description":
                    user_setting_tuple.description = body['description']
                case _:
                    unknown_parameter.append(f"'{key}'")
    except Exception:
        return {
            "success": False,
            "user": f"{user.username}#{user.tag}",
            "msg": "Your account is somehow corrupted. Please contact the customer service."
        }
    if len(unknown_parameter) > 0:
        return {
            "success": False,
            "user": f"{user.username}#{user.tag}",
            "msg": f"Unknown request parameter: {', '.join(unknown_parameter)}"
        }
    db.session.commit()
    updated_user_tuple = User.query.filter_by(id=user_tuple.id).first()
    return {
        "success": True,
        "user": f"{updated_user_tuple.username}#{user.tag}",
        "msg": "Successfully changed the the profile"
    }


def get_available_user_tag(username: str) -> int:
    controller: int = 0
    while True and controller < 100:
        ran_tag: int = generate_random_token()
        user_tuple_with_ran_tag = User.query.filter_by(username=username, user_tag=ran_tag).first()
        if user_tuple_with_ran_tag is None:
            return ran_tag
        controller += 1


def get_user_data(user: UserType) -> get_user_data_response:
    user_tuple = User.query.filter_by(username=user.username, user_tag=user.tag).first()
    if user_tuple is None:
        return {}
    user_setting_tuple = UserSetting.query.filter_by(id=user_tuple.user_setting_fk).first()
    user_key_tuple = UserKey.query.filter_by(id=user_tuple.user_key_fk).first()
    sweet_private_key: str = encryption.decrypt(user_key_tuple.private_key)
    sweet_public_key: str = encryption.decrypt(user_key_tuple.public_key)
    return {
        "username": user.username,
        "user_tag": user.tag,
        "first_name": user_tuple.first_name,
        "last_name": user_tuple.last_name,
        "email": user_tuple.email,
        "description": user_setting_tuple.description,
        "profile": user_setting_tuple.profile,
        "private_key": sweet_private_key,
        "public_key": sweet_public_key
    }


def is_valid_user(user: UserType, password: str) -> bool:
    user_tuple = User.query.filter_by(username=user.username, user_tag=user.tag).first()
    if user_tuple is None:
        return False
    delete_password_reset_code(user_tuple)
    return user_tuple.password == password and user_tuple.account_verification_code is None


def verify_account(code: str) -> True:
    user_tuple = User.query.filter_by(account_verification_code=code).first()
    if user_tuple is None:
        return False
    user_tuple.account_verification_code = None
    db.session.commit()
    return True


def generate_code() -> str:
    length: int = 40
    letters: str = string.ascii_lowercase + string.ascii_uppercase + string.digits
    random_code: str = ''.join(random.choice(letters) for i in range(length))
    return random_code


def delete_password_reset_code(user_tuple: User):
    user_tuple.password_reset_code = None
    db.session.commit()


def send_password_reset_code(user: UserType) -> bool:
    random_code: str = generate_code()
    user_tuple = User.query.filter_by(username=user.username, user_tag=user.tag).first()
    if user_tuple is None:
        return False
    email: str = user_tuple.email
    user_tuple.password_reset_code = random_code
    db.session.commit()
    send_password_reset_mail(email, user.user, random_code)
    return True


def reset_password(code: str, password: str) -> bool:
    user_tuple = User.query.filter_by(password_reset_code=code).first()
    if user_tuple is None:
        return False
    user_tuple.password_reset_code = None
    user_tuple.password = password
    db.session.commit()
    return True


# TODO: Faster SQL with JOIN
def get_user_contact(user: UserType, status: UserContactStatusEnum, lookup_type: FriendOrUserEnum) -> list[UserType]:
    contacts: list[UserType] = []
    try:
        user_id: int = User.query.filter_by(username=user.username, user_tag=user.tag).first().id
    except AttributeError:
        return []
    user_contacts_lookup_tuples: list[UserContactsLookup]
    match lookup_type:
        case FriendOrUserEnum.USER:
            user_contacts_lookup_tuples = UserContactsLookup.query.filter_by(user_fk=user_id)
        case FriendOrUserEnum.FRIEND:
            user_contacts_lookup_tuples = UserContactsLookup.query.filter_by(friend_fk=user_id)
        case _:
            return []
    for contact in user_contacts_lookup_tuples:
        if contact.status == status:
            contact_tuple: UserContactsLookup
            match lookup_type:
                case FriendOrUserEnum.USER:
                    contact_tuple = User.query.filter_by(id=contact.friend_fk).first()
                case FriendOrUserEnum.FRIEND:
                    contact_tuple = User.query.filter_by(id=contact.user_fk).first()
                case _:
                    return []
            contacts.append(UserType(contact_tuple.username, contact_tuple.user_tag))
    return contacts


def invite_user(user: UserType, invite: UserType) -> bool:
    # TODO: Check if blocked
    if user.user == invite.user:
        return False
    user_id: int = User.query.filter_by(username=user.username, user_tag=user.tag).first().id
    invite_tuple: User = User.query.filter_by(username=invite.username, user_tag=invite.tag).first()
    if invite_tuple is None:
        return False
    invite_id = invite_tuple.id
    existing_user_contact_lookup: UserContactsLookup = UserContactsLookup.query.filter_by(user_fk=user_id, friend_fk=invite_id).first()
    if existing_user_contact_lookup is not None:
        existing_status: UserContactStatusEnum = existing_user_contact_lookup.status
        if not existing_status == UserContactStatusEnum.FRIENDS or not existing_status == UserContactStatusEnum.BLOCKED:
            existing_user_contact_lookup.status = UserContactStatusEnum.INVITED
            db.session.commit()
            return True
        return False
    new_user_contact_lookup: UserContactsLookup = UserContactsLookup(user_id, invite_id, UserContactStatusEnum.INVITED)
    db.session.add(new_user_contact_lookup)
    db.session.commit()
    return True


def parse_invite_response(user: UserType, invite: UserType, invite_response: InvitationResponseEnum) -> bool:
    user_tuple: User = User.query.filter_by(username=user.username, user_tag=user.tag).first()
    invite_tuple: User = User.query.filter_by(username=invite.username, user_tag=invite.tag).first()
    user_contact_lookup_tuple: UserContactsLookup = UserContactsLookup.query.filter_by(user_fk=invite_tuple.id, friend_fk=user_tuple.id).first()
    if user_contact_lookup_tuple is None:
        return False
    if invite_response == InvitationResponseEnum.ACCEPT:
        if user_contact_lookup_tuple.status != UserContactStatusEnum.INVITED.INVITED:
            return False
        user_contact_lookup_tuple.status = UserContactStatusEnum.FRIENDS
        db.session.commit()
        return True
    if invite_response == InvitationResponseEnum.DECLINE:
        if user_contact_lookup_tuple.status != UserContactStatusEnum.INVITED.INVITED:
            return False
        db.session.delete(user_contact_lookup_tuple)
        db.session.commit()
        return True
    return False


def are_friends(user: UserType, other: UserType) -> bool:
    user_tuple: User = User.query.filter_by(username=user.username).first()
    other_tuple: User = User.query.filter_by(username=other.username).first()
    if user_tuple is None or other_tuple is None:
        return False
    user_contacts_lookup_tuple: UserContactsLookup = UserContactsLookup.query.filter_by(user_fk=user_tuple.id, friend_fk=other_tuple.id).first()
    other_contacts_lookup_tuple: UserContactsLookup = UserContactsLookup.query.filter_by(user_fk=other_tuple.id, friend_fk=user_tuple.id).first()
    result: bool = False
    if user_contacts_lookup_tuple is None:
        result = result or False
    else:
        result = result or user_contacts_lookup_tuple.status == UserContactStatusEnum.FRIENDS
    if other_contacts_lookup_tuple is None:
        result = result or False
    else:
        result = result or other_contacts_lookup_tuple.status == UserContactStatusEnum.FRIENDS
    return result


def send_message(user: UserType, friend: UserType, sender_message: str, reciever_message: str):
    user_tuple: User = User.query.filter_by(username=user.username, user_tag=user.tag).first()
    friend_tuple: User = User.query.filter_by(username=friend.username, user_tag=friend.tag).first()
    if user_tuple is None or friend_tuple is None:
        return False
    user_message: UserMessage = UserMessage(user_tuple.id, friend_tuple.id, sender_message, reciever_message)
    db.session.add(user_message)
    db.session.commit()
    return True


def get_messages(user: UserType, friend: UserType) -> get_messages_response:
    user_tuple: User = User.query.filter_by(username=user.username, user_tag=user.tag).first()
    friend_tuple: User = User.query.filter_by(username=friend.username, user_tag=friend.tag).first()
    if user_tuple is None or friend_tuple is None:
        return {"status": False}
    messages: [message_type] = []
    user_messages: [UserMessage] = UserMessage.query.filter_by(sender_fk=user_tuple.id, reciever_fk=friend_tuple.id).all()
    friend_messages: [UserMessage] = UserMessage.query.filter_by(sender_fk=friend_tuple.id, reciever_fk=user_tuple.id).all()
    friend_key_tuple = UserKey.query.filter_by(id=friend_tuple.user_key_fk).first()
    sweet_friend_public_key: str = encryption.decrypt(friend_key_tuple.public_key)
    for user_message in user_messages:
        messages.append({
            "sender_content": user_message.sender_content,
            "reciever_content": user_message.reciever_content,
            "user": user.user,
            "timestamp": float(user_message.timestamp)
        })
    for friend_message in friend_messages:
        messages.append({
            "sender_content": friend_message.sender_content,
            "reciever_content": friend_message.reciever_content,
            "user": friend.user,
            "timestamp": float(friend_message.timestamp)
        })
    return {
        "status": True,
        "messages": messages,
        "friend": friend.user,
        "public_key": sweet_friend_public_key
    }
