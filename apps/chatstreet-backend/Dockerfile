FROM ubuntu:latest

RUN apt-get update -y
RUN apt-get upgrade -y

RUN apt-get install \
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

EXPOSE 5000

ADD /app /chatstreet-backend/app

ADD requirements.txt /chatstreet-backend

WORKDIR /chatstreet-backend

RUN python3 -m venv venv

RUN pip install -r requirements.txt

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app.wsgi:app"]