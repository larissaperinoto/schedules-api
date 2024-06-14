# Schedules Service

### Tecnologies and Tools

- [Node.Js](https://nodejs.org/en)
- [Nest.Js](https://nestjs.com/)
- [Jest](https://jestjs.io/)
- [PostgreSQL](https://www.postgresql.org/)

### Pre requirements to run the project

- Node.Js (version >= 16)
- Docker or local Postgres
- Yarn

### Running the project

Clone this repository

        git clone git@github.com:larissaperinoto/schedules-api.git

Install dependencies

        yarn install

#### Running with Docker

Create a postgres container with the command below

        docker run --name my-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

Check if the container was created. You should see **my-postgres** on the list

        docker ps

Create tables with the command bellow

        docker exec -i my-postgres psql -U postgres < database.sql

#### Running with local Postgres

Through the terminal, log into your postgres and run the command bellow to create postgres database

        CREATE DATABASE postgres;

Then copy the contents of the **database.sql** file located at the root of the project and run the query to create the tables

#### Environment

Create a .env file in the root and define your project's environment variables

        PORT=3001
        DB_NAME=postgres
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

You can test the endpoints through the documentation page using the **Try it out** button or through your preferred client
