# Installation and Setup

## Express App

Requirements: Node.JS installed <br />
Run npm i to installed required dependencies <br />
create .env file in root folder. <br />

### Env Vars Explanation

DATABASE_URL, the DB for mySQL

### DB Setup & Migration Scripts

Create DB named d3_teachers <br />
DATABASE_URL should follow this format, DATABASE_URL="mysql://user:password@localhost:3306/dbname" <br />
Run this command to seed the db and create the tables. npm run db:migrate <br />

### Dependencies

express: rest framework for creating apis <br />
nodemon: hot reloads node app on save <br />
vitest: library for writing unit tests <br />
supertest: library for writing unit tests for https <br />
prisma: ORM for running db queries <br />
zod: for backend validation <br />
http-status-codes: for common response codes <br />
typescript for typing and autocompletion <br />

## Structure

- app.js is the main entry point for the express app. <br />
- src/utils is where common utility funcs and consts are stored <br />
- src/routes stores api routes for user stories and calls controllers <br />
- src/controllers handle request/response logic <br />
- src/service stores business logic and the ORM queries that call DB. <br />
- src/middleware stores the middlware that should be called before/after controller actions. <br />

## Hosted Api

http://18.141.138.121:3000/
