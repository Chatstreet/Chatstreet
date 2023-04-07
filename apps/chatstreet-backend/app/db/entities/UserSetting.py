from app.db import db


class UserSetting(db.Model):
    __tablename__ = 'user_setting'

    id = db.Column('id', db.Integer, primary_key=True)
    description = db.Column('description', db.String(300))
    profile = db.Column('profile', db.Text)

    user = db.relationship('User', backref='setting')

    def __init__(self, description: str):
        self.description = description
