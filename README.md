## DEV
```shell
docker compose -f docker-compose.dev.yaml build --no-cache
docker compose -f docker-compose.dev.yaml -p chatstreet-dev up -d
```
## PROD
```shell
docker compose -f docker-compose.prod.yaml build --no-cache
docker compose -f docker-compose.prod.yaml -p chatstreet-prod up -d
```
