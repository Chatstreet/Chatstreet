# Chatstreet-Backend
School project module - 347. Deployable chat application.

## Run Flask Server locally

Firstly install all the requirements in the `requirements.txt` file.
I recommend you using a virtual environment for this.

```shell
pip install -r requirements.txt
```

To run the MiSe in debug mode you can now use the following command:

```shell
flask run --debug
```

## Run docker container (production)

In order to start the docker container you will first need to create a docker image. You can use the following command to do that:

```shell
docker build -t chatstreet-backend:latest .
```

Once the image is created, use this command to start the development container:

```shell
docker run -d -p 5000:5000 -e APP_ENV=DEV chatstreet-backend:latest
```

_Make sure to also run the database in development mode, else the connection won't be able to establish._

The container should be reachable at `localhost:5000`

## Environment Variables

The flask application uses certain environment variables like secret database urls etc. The most convenient way to set up these variables is to create a `.env` file in the chatstreet-backend. For the configuration of said file please contact [David Abderhalden](mailto:david.abderhalden@edu.tbz.ch).

Here is an example what the env file could look like:
```conf
PROD_DATABASE_USERNAME=<prod-user>
PROD_DATABASE_PASSWORD=<prod-password>
PROD_DATABASE_HOST=<prod-host>
PROD_DATABASE_PORT=<prod-port>
PROD_DATABASE_NAME=<prod-database>

DEV_DATABASE_USERNAME=<dev-user>
DEV_DATABASE_PASSWORD=<dev-password>
DEV_DATABASE_HOST=<dev-host>
DEV_DATABASE_PORT=<dev-port>
DEV_DATABASE_NAME=<dev-database>

LOCAL_DATABASE_USERNAME=<local-user>
LOCAL_DATABASE_PASSWORD=<local-password>
LOCAL_DATABASE_HOST=<local-host>
LOCAL_DATABASE_PORT=<local-port>
LOCAL_DATABASE_NAME=<local-database>

# You can create a simple gmail address
MAIL_SERVER=<smtp-host>
MAIL_PORT=<smtp-port>
MAIL_USERNAME=<first-name.last-name>
MAIL_PASSWORD=<app-password>
EMAIL_SENDER=<email-address>

LOCAL_FRONTEND_BASE_URL=<local-host:local-port>
DEV_FRONTEND_BASE_URL=<dev-host:dev-port>
PROD_FRONTEND_BASE_URL=<prod-host:prod-port>

JWT_SECRET_KEY=<secret>
BINARY_FERNET_KEY=<binary>
```

<div style="border-top: 1px solid grey; display: flex; justify-content: space-between; align-items: center;">
	<p>Last Update:</p>
	<p>11.05.2023</p>
</div>