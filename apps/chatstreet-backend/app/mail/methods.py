from flask import render_template
from flask_mail import Message

FRONTEND_BASE_URL: str = "localhost:7331"  # TODO: Change to frontend url, outsource to env


def send(message: Message):
    from app import mail
    mail.send(message)


def send_verification_mail(recipient: str, verification_code: str):
    title: str = 'Verify Your E-Mail'
    template: str = 'mail/verification.html'
    url: str = f'https://{FRONTEND_BASE_URL}/account/verification/{verification_code}'
    msg = Message(title, recipients=[recipient])
    msg.html = render_template(template, email=recipient, link=url)
    send(msg)


def send_password_reset_mail(recipient: str, username: str, reset_code: str):
    title: str = 'Reset Your Password'
    template: str = 'mail/reset_password.html'
    url: str = f'https://{FRONTEND_BASE_URL}/account/reset/password/{reset_code}'
    msg = Message(title, recipients=[recipient])
    msg.html = render_template(template, username=username, link=url)
    send(msg)