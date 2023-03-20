# ChatStreet-Backend
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