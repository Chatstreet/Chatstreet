## Setup

If you haven't already, please make sure your docker deamon is running before proceding.

## Docker Image

To build the docker image use the following command:

```shell
docker build -t chatstreet-database:latest .
```

## Docker Container

To run the docker container you will need an `.env` file provided by [David Abderhalden](mailto:david.abderhalden@edu.tbz.ch).
Next up use the following command to run the container:

```shell
docker run -p 3306:3306 --env-file dev.env -d chatstreet-database:latest
```