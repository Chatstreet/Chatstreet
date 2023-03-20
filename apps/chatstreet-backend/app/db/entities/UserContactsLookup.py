from app.db import db
from app.enums.UserContactStatusEnum import UserContactStatusEnum


class UserContactsLookup(db.Model):
    __tablename__ = 'user_contacts_lookup'

    id = db.Column('id', db.Integer, primary_key=True)
    user_fk = db.Column('user_fk', db.Integer, db.ForeignKey('user.id'))
    friend_fk = db.Column('friend_fk', db.Integer, db.ForeignKey('user.id'))
    status = db.Column('status', db.Enum(UserContactStatusEnum))
