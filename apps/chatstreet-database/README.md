# Chatstreet-Database
School project module - 347. Deployable chat application.

## Setup

If you haven't already, please make sure your docker deamon is running before proceding.

## Docker Image

To build the docker image use the following command:

```shell
docker build -t chatstreet-database:latest .
```

## Docker Container

To run the docker container you will need an `.env` file provided by [David Abderhalden](mailto:david.abderhalden@edu.tbz.ch).
You can also create your own file, just make sure to provide the required params for the [mariadb image](https://hub.docker.com/_/mariadb).

Example:
```conf
MARIADB_ROOT_PASSWORD=<password>
MARIADB_USER=<user>
MARIADB_PASSWORD=<password>
MARIADB_DATABASE=<database>
```

Next up use the following command to run the container:

```shell
docker run -p 3306:3306 --env-file <path-to-env-file> -d chatstreet-database:latest
```

<div style="border-top: 1px solid grey; display: flex; justify-content: space-between; align-items: center;">
	<p>Last Update:</p>
	<p>11.05.2023</p>
</div>