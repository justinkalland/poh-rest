# Contributing

This is a living document. As you work through the steps, **please help out the next engineer** by contributing tips and fixes.

<!-- TOC is automatically generated -->
<!-- to update use the npm package markdown-toc (easy way: `npx markdown-toc -i CONTRIBUTING.md`) -->

<!-- toc -->

- [Welcome](#welcome)
- [Running Locally](#running-locally)
- [Testing](#testing)
- [Linting](#linting)

<!-- tocstop -->

## Welcome
The main goal of this project is to provide an easy-to-consume API. To do this requires a lot of juggling and mapping. For example, internally, the network uses the naming "disputes" such as disputed registration request. But the API provides it under "challenges". Another example is boiling down submissions & requests to "profiles". Choices were made to try and stick with the public, human-centric view of the relational data.

This project has three main pieces:
- Postgres database
  - Schema is managed by migration scripts in `src/migrations`
  - Schemas are generated mainly by [TypeORM](https://typeorm.io/#/migrations) using the Entities (models)
- Worker
  - `npm run start:worker:dev` this process runs scripts that collect and populate the Postgres database
- API Server
  - `npm run start:web:dev` this serves the REST API - from data in Postgres

## Running Locally
1. Install [node](https://nodejs.org/en/) and [PostgresSQL](https://www.postgresql.org/)
    1. On MacOS if you don't have Postgres, consider [Postgress.app](https://postgresapp.com/)
    1. If you are on Linux based system, consider your local package manager instead. 
    1. If you are on Windows, maybe you will have luck with their [new package manager](https://devblogs.microsoft.com/commandline/windows-package-manager-preview/)
1. Clone this repo
1. Copy `.env.example` to `.env` and edit as needed.
1. Setup your database and connection
    1. Create a database. If you have a preferred DB GUI, it would likely be best to use that. On Linux try `sudo -iu postgres`, then `createdb test`.
    1. You will likely need to edit the database URL for your system. For example, mine is `DATABASE_URL=postgres://postgres@localhost/test`
1. Run the DB migrations with `npm run typeorm:dev migration:run`
    1. If that does not work, you can also run the non-dev version with `npm run build && npm run typeorm migration:run`
    1. Note: You will need to periodically run migrations in the future, so keep the command in mind.
1. Populate the database
    1. `ts-node src/worker/scripts/processEntireGraph.ts`
    1. `ts-node src/worker/scripts/updateEvidenceCache.ts`
1. Start the worker locally with `npm run start:worker:dev`
1. Start the dev server locally with `npm run start:web:dev`
1. In the browser visit `localhost:3000/ping` and you should get a response of `pong`

## Testing

Todo ;)

## Linting

- `npm run lint`
