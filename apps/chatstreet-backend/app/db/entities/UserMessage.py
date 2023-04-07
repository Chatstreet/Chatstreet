import time
from app.db import db


class UserMessage(db.Model):
    __tablename__ = 'user_message'

    id = db.Column('id', db.Integer, primary_key=True)
    sender_fk = db.Column('sender_fk', db.Integer, db.ForeignKey('user.id'))
    reciever_fk = db.Column('reciever_fk', db.Integer, db.ForeignKey('user.id'))
    sender_content = db.Column('sender_content', db.Text, nullable=False)
    reciever_content = db.Column('reciever_content', db.Text, nullable=False)
    timestamp = db.Column('timestamp', db.String(100), nullable=False)

    def __init__(self, sender_fk: int, reciever_fk: int, sender_content: str, reciever_content: str):
        self.sender_fk = sender_fk
        self.reciever_fk = reciever_fk,
        self.sender_content = sender_content,
        self.reciever_content = reciever_content,
        self.timestamp = time.time()
