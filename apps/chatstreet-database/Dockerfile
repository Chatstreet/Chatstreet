FROM mariadb:latest

# Runs when container is created
COPY init.sql /docker-entrypoint-initdb.d/

COPY 50-server.cnf /etc/mysql/mariadb.conf.d/

EXPOSE 3306
