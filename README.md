# Schedules Service

### Tecnologies and Tools

- [Node.Js](https://nodejs.org/en)
- [Nest.Js](https://nestjs.com/)
- [Jest](https://jestjs.io/)
- [PostgreSQL](https://www.postgresql.org/)

### Pre requirements to run the project

- Node.Js (version >= 16) installed
- Docker or local Postgres installed
- Yarn installed

### Running the project

Clone this repository

        git clone git@github.com:larissaperinoto/schedules-api.git

Install dependencies

        yarn install

#### Running with Docker

Create a postgres container with the command below replacing the username (POSTGRES_USER) and password (POSTGRES_PASSWORD) information if necessary

        docker run --name my-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=schedules -p 5432:5432 -d postgres

Check if the container was created. You should see **postgres-container** in the list

        docker ps

Create tables with the command bellow

        docker exec -i my-postgres psql -U postgres < database.sql

#### Running with local Postgres

Through the terminal, log into your postgres and run the command bellow to create schedules database

        CREATE DATABASE schedules;

Then copy the contents of the **database.sql** file located at the root of the project and run the query to create the tables

#### Environment

Create a .env file in the root and define your project's environment variables

        PORT=3001
        DB_NAME=schedules
        DB_PORT=5432
        DB_HOST=localhost
        DB_USERNAME=postgres
        DB_PASSWORD=postgres

Start the application

        yarn start

If you want to start as a developer, use the command below

        yarn start:dev

#### Running tests

Run all tests at the same time

        yarn test

Run a specific test

        yarn test <file name>

Run tests with coverage

        yarn test --coverage
        or
        yarn test <file name> --coverage

### Documentation

After starting the service, check the endpoint documentation using the address below in the browser

        http://localhost:3001/api
