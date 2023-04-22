from flask import render_template
from flask_mail import Message
import re


def send(message: Message) -> bool:
    from app import mail
    mail.send(message)
    try:
        mail.send(message)
        return True
    except Exception:
        return False


def send_verification_mail(recipient: str, verification_code: str) -> bool:
    if not is_valid_email(recipient):
        return False
    title: str = 'Verify Your E-Mail'
    template: str = 'mail/verification.html'
    url: str = f'http://{conf.FRONTEND_BASE_URL}/account/verification/{verification_code}'
    msg = Message(title, recipients=[recipient])
    msg.html = render_template(template, email=recipient, link=url)
    return send(msg)


def send_password_reset_mail(recipient: str, username: str, reset_code: str) -> bool:
    if not is_valid_email(recipient):
        return False
    title: str = 'Reset Your Password'
    template: str = 'mail/reset_password.html'
    url: str = f'http://{conf.FRONTEND_BASE_URL}/account/reset/password/{reset_code}'
    msg = Message(title, recipients=[recipient])
    msg.html = render_template(template, username=username, link=url)
    return send(msg)

def is_valid_email(email: str) -> bool:
    return re.match('^[a-zA-Z0-9-_]+@[a-zA-Z0-9]+\.[a-z]{1,3}$', email)