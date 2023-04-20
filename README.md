<h1 align="center">Baseport</h1>

## Overview
Baseport is a really simple boilerplate to build a REST API with authentication written in JavaScript and using Docker, Express, Joi, Knex, Supabase and Passport

It sets up an Express REST API with Supabase, providing features like Docker containerization, database connection, authentication, error handling, and more. It includes some basic routes for authentication and user creation to kickstart most projects.

## Key Features
- **Docker containerization** to enable easy deployment with no need to install PostgreSQL.
- Session-based authentication provided using [**Passport**](https://www.passportjs.org/).
- A strong and reliable relational database included with [**PostgreSQL**](https://www.postgresql.org/).
- A simplified database query builder managed by [**Knex**]().
- A Straightforward database migration and seeding strategy with [**Knex**]().
- Custom error handling implemented using [**error-handler**]().
- Basic security features provided through [**Helmet**](https://helmetjs.github.io/) and [**Cors**](https://github.com/expressjs/cors).
- Flexible logging implemented with [**pino**]().
- Security enhancements thanks to [**bcrypt**](https://github.com/validatorjs/validator.js) hashing and [**crypto**]() encryption.

## Use Case
Not all projects require a full-blown backend framework like [NestJS](https://nestjs.com/), [AdonisJS](https://adonisjs.com/), [Loopback](https://loopback.io/), etc. Sometimes you just need a simple REST API with just authentication and a database connection.

The historic process has been to start from scratch, setting up the project structure, installing dependencies, configuring the database, etc. This process can be time-consuming and tedious, especially if you're not fully familiar with the technologies involved. And quality or integrity shouldn't be sacrificed by using less than ideal solutions.

Thus, Baseport provides (myself) a ready-to-use but comprehensive template to quickly start building REST APIs for small projects (hobbies, small websites, etc.) with authentication and other common features, that are able and safe to share a same database. This saves me time and effort in setting up the initial project structure and configurations every single time.

Better yet, Baseport is designed to serve as a main server so that multiple created apps can share the same database, while their unique concerns remain separate. For example, wy have 10 user tables with the same columns, when you could simply link new tables and databases of new projects to a singular user repository?

For entrepreneurship and bringing small ideas / MVPS to life, it feels like a godsend so far.

---

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Migrations](#migrations)
- [Logging](#logging)
- [License](#license)

---

## Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

#### Install [Node.js and NPM](https://nodejs.org/en/download/)

- For OSX, you can use [homebrew](http://brew.sh) | `brew install node`
- For Windows, you can use [chocolatey](https://chocolatey.org/) | `choco install nodejs`

#### Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

- Install Docker Desktop
- Run Docker Desktop (runs silently)

### Step 2: Clone the project

```bash
git clone https://github.com/dionisggr/backend-template.git
cd backend-template
rm -rf .git # Windows: rd /s /q .git
```
> `rm -rf .git` (or `rd /s /q .git` on Windows) deletes the git info of the branch like history.

To create your new history, simply run `git init`.

### Step 3: Install dependencies
- Install all dependencies with `npm ci`.
  ##### Note that running `npm install` instead will install the latest versions of dependencies, which may surface incompatibility.

### Step 4: Login to Supabase
The PostgreSQL setup is already done, thanks to [Supabase](https://supabase.com/). You just need to login to your Supabase account.
```bash
npx supabase login
```

### Step 5: Setting up environment variables
Rename the `new.env` file to `.env` and add your environment variables. If you're authorized, you can find the list of environment variables [here](#environment-variables).

### Step 6-A: Setup (Quick)
The following command will pull any table schema changes done through Supabase's web client, start the Supabase server, run the migrations and seed the database.
```bash
npm run setup
```

### Step 6-B: Setup (Manual)
If you prefer a more granular step-by-step approach, you can follow these steps:
1. Pull latest table schema changes: `npm run db:pull`
2. Start the Supabase start: `npm run db:start`
3. Create the database tables: `npm run migrations`
4. Seed the database: `npm run seeds`

### Step 6-C: Setup (Control the matrix)
If you prefer a fully manual setup, you can follow these steps:
1. Pull latest table schema changes: `npm run db:pull`
2. Start the Supabase start: `npm run db:start`
3. Access the database with `psql <DEV_DB_URL>`
3. Use [`psql` commands](https://www.postgresql.org/docs/current/app-psql.html) to navigate to the desired database/table
4. Use [`SQL` queries](https://www.bitdegree.org/learn/sql-commands-list) to manipulate the tables and data to your preference

### Step 7: Run the server
- **Prod**: `npm run start`
- **Dev**: `npm run dev`
> `npm run dev` starts a local server on `http://localhost:8000` using `nodemon`, which will watch for any file changes and will restart the server according to these changes.

### Step 8: Migrations
#### To run non-executed migrations up the most recent one:
```bash
npm run migrations
```
#### If you need to roll back all executed migrations (blank slate):
```bash
npm run migrations:rollback
```

### Step 9. Seeding
#### To run all seed files:
```bash
npm run seeds
```

#### To generate a new seed file (uses current date and time in milliseconds as prefix):
```bash
npm run seeds:create
```

---

## API Endpoints

You can watch the full API Docs powered by Swagger UI [here](). Here is a summary:
<table style="width: 500px;">
  <tr>
    <th>Endpoints</th>
    <th>Methods</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><b>/<b></td>
    <td>GET</td>
    <td>Health Check</td>
  </tr>
  <tr>
    <td><b>/docs</b></td>
    <td>GET</td>
    <td>API Docs</td>
  </tr>
  <tr>
    <td><b>/register</b></td>
    <td>POST</td>
    <td>User registration</td>
  </tr>
  <tr>
    <td><b>/login</b></td>
    <td>POST</td>
    <td>User login</td>
  </tr>
  <tr>
    <td><b>/users</b></td>
    <td>GET | PATCH | DELETE</td>
    <td>User data</td>
  </tr>
  <tr>
    <td><b>/utils</b></td>
    <td>GET | POST</td>
    <td>Services</td>
  </tr>
</table>

---

## Project Structure
```bash
├── migrations/
│   ├── ...  # Directory for database migration scripts
├── node_modules/
│   ├── ...  # Directory for third-party packages installed by npm
├── seeds/
│   ├── ...  # Directory for database seed data
├── src/
│   ├── middleware/
│   │   ├── auth.js  # Middleware for authentication
│   │   ├── error-handler.js  # Middleware for error handling
│   │   └── passport.js  # Middleware for Passport session-based authentication
│   ├── routes/
│   │   ├── apps.js  # Route handler for app requests
│   │   ├── docs.js  # Route handler for API documentation
│   │   ├── health.js  # Route handler for health check
│   │   ├── login.js  # Route handler for user login
│   │   ├── routers.js  # Main router file
│   │   ├── users.js  # Route handler for user requests
│   │   └── utils.js  # Route handler for using utility functions {hash, encryption}
│   ├── services/
│   │   ├── apps.js  # Database service for apps
│   │   ├── CRUD.js  # Database service for the general CRUD operations (ie. utils)
│   │   ├── passwords.js  # Database service for generating and verifying passwords
│   │   ├── schemas.js  # Database service for request input schema management
│   │   ├── user_apps.js  # Database service for links between users and apps
│   │   └── users.js  # Database service for users
│   ├── app.js  # Main application file
│   └── config.js  # Main configuration file
├── supabase
│   ├── ...  # Directory containing Supabase configuration files
├── .env  # Environment variables file
├── db.js  # Database connection file (Knex instance)
├── docs.yaml  # API documentation file
├── knexfile.js  # Knex configuration file
└── server.js  # Server entry point file
```

---

## Environment Variables

| Name             | Description                        | Default value |
| ---------------- | ---------------------------------- | ------------- |
| PORT             | Server host port                   | 8000 |
| NODE_ENV         | Defines environment var            | development | 
| DEV_DB_URL       | Database name                      | postgresql://postgres:postgres@localhost:54322/postgres |
| PROD_DB_URL      | Database username                  | none |
| API_KEY          | Server host                        | none |
| ADMIN_PASSWORD   | Database host port                 | none |

---

## Authentication
`Passport.js` is used to handle authentication. This is a flexible and modular authentication middleware that allows you to easily add new authentication strategies like login with Facebook, Google, Github, etc. The current setup allows only for a fully manual authentication process that leverages a local strategy using `passport-local`.

The `Passport` configuration and functions are located in `src/middlware/passport.js`.

### Access
The `serializeUser` defines what data are saved in request session, generally we save the user id.

The `deserializeUser` allows getting the whole user object and assigning it in `req.user`, so you can easily get the authenticated user with `req.user`. You don't need to explicitly call `deserializeUser` before calling `req.user`.

> You can find the Passport docs [here](https://www.passportjs.org/).

### Route Protection
To protect a route, you can assign the path to the `authorized` or the `authenticated` auth middlewares within `src/routes/routers.js` for the desired level of protection.

To check if a user is authenticated before accessing a route, the authentication middleware checks for `req.isAuthenticated()`. This runs to check if a particular `Cookie` set from a previous login process is present and unexpired. You can set the expiration time in `src/config.js` within the `auth` object. The default expiration time is 1 hour, with a check every 30 minutes for new requests to renew cookies as appropriate.

---

## Migrations
Thanks to Knex, you can easily manage your migrations. These are stored in a the `migrations/` folder (and a `knex_migrations` table inside the database), and are executed in alphanumeric order. This allows for an easy migration and rollback process that follows a consistent order.

The sorting strategy used is established by the migration file's prefix, which is a timestamp in milliseconds. This means that the migration files are sorted by the date and time they were created.

### Running migrations
#### To run non-executed migrations up the most recent one:
```bash
npm run migrations
```
#### To generate a new migration file (uses current date and time in milliseconds as prefix):
```bash
npm run migrations:create
```
#### To undo all executed migrations (blank slate):
```bash
npm run migrations:rollback
```
#### To fully rollback and re-run all migrations:
```bash
npm run migrations:reset
```
> For more granular manipulation, please refer to the [Knex documentation on migrations](https://knexjs.org/guide/migrations.html#migration-cli).

### Format
The format for migration files is regular JavaScript. Knex searches for two functions inside these files to pass in the database instance: `exports.up = function () {}` and `exports.up = function (db) {}`, each representing a migration or rollback respectively. As such, each file will contain its own individual migration and rollback logic.

You should get more familiar with the [`Knex.js` syntax](https://knexjs.org/guide/migrations.html#transactions-in-migrations) for establishing tables and field types. The following is an example:
```javascript
exports.up = async function(db) {
  await db.schema.dropTableIfExists('superheroes');
  await db.schema.createTable('superheroes', function(table) {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('alter_ego').notNullable().unique();
    table.string('superpower').notNullable();
    table.boolean('is_alive').notNullable().defaultTo(true);
    table.date('first_appearance').notNullable();
    table.string('archenemy').defaultTo(null);
    table.string('costume_color').notNullable();
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
  }).catch(error => logger.error('Error creating table:', error));

  logger.info('Table "superheroes" created successfully!');
};

exports.down = async function(db) {
  await db.schema.dropTableIfExists('superheroes').catch(error => {
    logger.error('Error deleting table:', error)
  });
};
```

---

## Logging

To log HTTP requests, the [`morgan`](https://github.com/expressjs/morgan) express middleware is used. It can be easily configured through the `morgan` object in `src/config.js`.

For more structured logging, the [`pino`]() logging library is leveraged. Similarly, more specific configuration can be set within the `logger` obect in `src/config.js`.

---

## Contributing

Anyone and everyone is welcome to contribute.

For the moment, I have no contributing guidelines. This project has been mainly set up for personal use, but next steps in the roadmap concern making it more accessible and easily usable to the community. As well as establishing

If you want to propose new features, fix a bug or improve the README, don't hesitate to open a pull request. If your changes concern new feature or bugfix, please open an issue before.

---

## License

[MIT](/LICENSE)
