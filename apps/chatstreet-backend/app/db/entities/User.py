from app.db import db


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column('id', db.Integer, primary_key=True)
    user_key_fk = db.Column('user_keys_fk', db.Integer, db.ForeignKey('user_key.id', ondelete='CASCADE'), nullable=False)
    user_setting_fk = db.Column('user_setting_fk', db.Integer, db.ForeignKey('user_setting.id', ondelete='CASCADE'), nullable=False)
    first_name = db.Column('first_name', db.String(100), nullable=False)
    last_name = db.Column('last_name', db.String(100), nullable=False)
    password = db.Column('password', db.String(100), nullable=False)
    email = db.Column('email', db.String(100), nullable=False, unique=True)
    username = db.Column('username', db.String(100), nullable=False)
    user_tag = db.Column('user_tag', db.Integer, nullable=False)

    user_contact = db.relationship('UserContactsLookup', backref='user_contact', foreign_keys='UserContactsLookup.user_fk')
    user_friend = db.relationship('UserContactsLookup', backref='user_friend', foreign_keys='UserContactsLookup.friend_fk')
    user_sender = db.relationship('UserMessage', backref='user_sender', foreign_keys='UserMessage.sender_fk')
    user_reciever = db.relationship('UserMessage', backref='user_reciever', foreign_keys='UserMessage.reciever_fk')

    def __init__(self,
                 user_key: int,
                 user_setting: int,
                 first_name: str,
                 last_name: str,
                 password: str,
                 email: str,
                 username: str,
                 user_tag: int):
        self.user_key_fk = user_key
        self.user_setting_fk = user_setting,
        self.first_name = first_name,
        self.last_name = last_name,
        self.password = password,
        self.email = email,
        self.username = username,
        self.user_tag = user_tag
