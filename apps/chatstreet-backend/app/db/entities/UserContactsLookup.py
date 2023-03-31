from app.db import db
from app.enums.UserContactStatusEnum import UserContactStatusEnum


class UserContactsLookup(db.Model):
    __tablename__ = 'user_contacts_lookup'

    id = db.Column('id', db.Integer, primary_key=True)
    user_fk = db.Column('user_fk', db.Integer, db.ForeignKey('user.id'))
    friend_fk = db.Column('friend_fk', db.Integer, db.ForeignKey('user.id'))
    status = db.Column('status', db.Enum(UserContactStatusEnum))

    def __init__(self, user_fk: int, friend_fk: int, status: UserContactStatusEnum):
        self.user_fk = user_fk
        self.friend_fk = friend_fk
        self.status = status
