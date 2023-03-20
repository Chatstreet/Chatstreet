import time
from app.db import db


class UserMessage(db.Model):
    __tablename__ = 'user_message'

    id = db.Column('id', db.Integer, primary_key=True)
    sender_fk = db.Column('sender_fk', db.Integer, db.ForeignKey('user.id'))
    reciever_fk = db.Column('reciever_fk', db.Integer, db.ForeignKey('user.id'))
    content = db.Column('content', db.String(8192), nullable=False)
    timestamp = db.Column('timestamp', db.String(100), nullable=False)

    def __init__(self, sender_fk: int, reciever_fk: int, content: str):
        self.sender_fk = sender_fk
        self.reciever_fk = reciever_fk,
        self.content = content,
        self.timestamp = time.time()
