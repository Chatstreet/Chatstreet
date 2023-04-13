docker build -t chatstreet-frontend:latest .
docker run -d -p 8080:80 chatstreet-frontend:latest