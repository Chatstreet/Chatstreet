from app.db import db


class UserKey(db.Model):
    __tablename__ = 'user_key'

    id = db.Column('id', db.Integer, primary_key=True)
    private_key = db.Column(db.Text)
    public_key = db.Column(db.Text)

    user = db.relationship('User', backref='keys')

    def __init__(self, private_key: str, public_key: str):
        self.private_key = private_key
        self.public_key = public_key
