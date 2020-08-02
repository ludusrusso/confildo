# Simple configuration server

This project implements a Configuration server exposing simple Rest API
to get, create, update and delete configurations.

## Install deps

```bash
npm install
```

## Run the server

To run the server, simply use `npm run start`.

You need access to a postgres database configured with the scema described in [database/init.sql](./database/init.sql).

You can specify the database connecting information using the following env variables:

```
export DB_NAME=postgres
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_HOST=localhost
export DB_PORT=5432
```

## Run the database with docker compose

If you need a database, you can start it with docker-compose using

```
docker-compose up db
```

This command will create and initialize a debug database that you can use to
test the server listening on port 5432.

## Run the server and database with docker compose

If you want to run both server and database using docker, you can use

```
docker-compose up
```

This will start both the database and the server listening on port 3000 of your
computer.

## Testing

You can run integration tests using the command

```
npm run test
```

This command will start all tests defined in files `src/*.spec.ts`.

Tests relies on the project [`testcontainrs`](https://www.testcontainers.org/), so you need to have access to docker and docker-compose on your machine!

## Build

You can build the server using `npm run build`. This will create a `dist/` folder with compiled files.

You can also create a docker container using `docker-compose build server`. Note that you need to call `npm run build` before creating the container.

## Deploy

This server as been deployed on my personal k8s cluster for testing.

The deployment has been performed accordingly to the [`k8s/server.yaml`](./k8s/server.yaml) file in this project.

Database runs as a helm chart!

You can access the api at [https://api.buildo.k8s.ludusrusso.space](https://api.buildo.k8s.ludusrusso.space)

## TO DO

### Improve testcontainers postgres readiness check

At the moment, I do not wait for the database container to be fully initialized before starting tests. On my local machines, this seems not a problem and tests runs correctly, but this may produce (I'm not sure 100%) test fails on different hardware.

### Authentication and Authorization

The server is not authenticated. It could be nice to improve it with a layer of Authentication and Authorization, maybe based on jwt.

### CI/CD

To improve deployment and future development, a pipeline for CI/CD is needed.

## How to contribute to this project?

1. For this project on github!
2. Install locally and ensure tests passes (see instruction above)
3. Add your improvements (please ensure also to add tests)
4. Submit a pull request
