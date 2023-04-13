FROM ubuntu:latest

ENV APP_ENV "PROD"

RUN apt-get update -y
RUN apt-get upgrade -y

RUN apt-get install \
    curl -y \
    python3 -y \
    python3-pip -y \
    python3-dev -y \
    build-essential -y \
    libssl-dev -y \
    libffi-dev -y \
    python3-setuptools -y \
    python3-venv -y \
    nginx -y \
    gunicorn

EXPOSE 80

ADD /app /chatstreet-backend/app

ADD requirements.txt /chatstreet-backend

ADD .env /chatstreet-backend

WORKDIR /chatstreet-backend

RUN python3 -m venv venv

RUN pip install -r requirements.txt

CMD gunicorn --bind 0.0.0.0:80 app.wsgi.${APP_ENV}:app
