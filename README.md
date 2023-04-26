<h1 align="center">Baseport</h1>

## What is it?
Baseport is a really simple but comprehensive boilerplate written for Node.js/Express.js to build a containerized REST API that includes authentication, input validation and sanitizing, database migrations, seeding and query building, and the open-source PostgreSQL-based Firebase alernative, [Supabase](https://supabase.com/).

## What does it use?
- [**Docker containerization**](https://www.docker.com/resources/what-container/) to enable easy deployment with no need to install PostgreSQL.
- Session-based authentication provided using [**Passport**](https://www.passportjs.org/).
- A strong and reliable relational database included with [**PostgreSQL**](https://www.postgresql.org/).
- A simplified database query builder managed by [**Knex**](https://knexjs.org/).
- A Straightforward database migration and seeding strategy with [**Knex**](https://knexjs.org/).
- Custom error handling implemented using [**error-handler**](https://github.com/dionisggr/baseport/blob/main/src/middleware/error-handler.js).
- Basic security features provided through [**Helmet**](https://helmetjs.github.io/) and [**Cors**](https://github.com/expressjs/cors).
- Flexible logging implemented with [**pino**](https://github.com/pinojs/pino).
- Security enhancements thanks to [**bcrypt**](https://github.com/kelektiv/node.bcrypt.js/) hashing and [**crypto**](https://www.npmjs.com/package/crypto-js) encryption.

## Why build it?
Not all projects require a full-blown backend framework like [NestJS](https://nestjs.com/), [AdonisJS](https://adonisjs.com/), [Loopback](https://loopback.io/), etc. Sometimes you just need a simple REST API with a database connection and some essentials like authentication, input validation/sanitizing and easy database manipulation.

The historic process has been to start from scratch, setting up the project structure, installing dependencies, configuring the database, etc. This process can be time-consuming and tedious, especially if you're not fully familiar with the technologies involved and their extensive configuration files. And quality or integrity shouldn't be sacrificed by using less than ideal solutions.

Thus, Baseport provides (myself) a strong production-ready template to quickly start building REST APIs for smaller projects (hobbies, small websites, etc.), including all the features abovementioned, and set up in a single, common database. This saves me time and effort in setting up the initial structure and configurations every single time for every project, and allows me to focus in the faster-paced client requirements cycle. Naturally, as projects and user bases grow, more isolated alternatives should be considered.

---

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
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
git clone https://github.com/dionisggr/baseport.git

cd baseport
```

### Step 3: Install dependencies
- Install all dependencies with `npm ci`.
  ##### Note that running `npm install` instead will install the latest versions of dependencies, which may surface incompatibility.

### Step 4: Login to Supabase
The PostgreSQL setup is already done, thanks to [Supabase](https://supabase.com/). You just need to create or login to your Supabase account.
```bash
npx supabase login
```

### Step 5: Setting up environment variables
Rename the `new.env` file to `.env` and add the missing environment variables. If you're authorized, you can request the secrets directly to the `/secrets` endpoint, using Postman or the Swagger UI. If you're an `admin`, you should receive the secrets back in JSON format.

You will need to provide your email and password in the request body, like so:
```bash
{
  "email": "<email>",
  "password": "<password>"
}
```

### Step 6-A: Setup (Quick)
The following command will pull any table schema changes done through Supabase's web client, start the Supabase server, run the migrations, seed the database and set up some helpful terminal aliases.
```bash
npm run setup
```

### Step 6-B: Setup (Manual)
If you prefer a more granular step-by-step approach, you can follow these steps:
1. Pull latest table schema changes: `npm run db:pull`
2. Start the Supabase start: `npm run db:start`
3. Create the database tables: `npm run migrations`
4. Seed the database: `npm run seeds`
4. Set up terminal alises: `source src/aliases.sh`

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

You can watch the full API Docs powered by Swagger UI [here](https://tec3-api-production.up.railway.app/docs). Here is a summary:
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
    <td><b>/secrets</b></td>
    <td>GET</td>
    <td>Admin-authenticated ENV vars</td>
  </tr>
  <tr>
    <td><b>/apps</b></td>
    <td>GET</td>
    <td>All apps</td>
  </tr>
  <tr>
    <td><b>/apps/:id</b></td>
    <td>GET</td>
    <td>Sigle app</td>
  </tr>
  <tr>
    <td><b>/apps/:id/register</b></td>
    <td>POST</td>
    <td>User registration</td>
  </tr>
  <tr>
    <td><b>/apps/:id/login</b></td>
    <td>POST</td>
    <td>User login</td>
  </tr>
  <tr>
    <td><b>/apps/:id/logout</b></td>
    <td>POST</td>
    <td>User logout</td>
  </tr>
  <tr>
    <td><b>/apps/:id/users/:user_id?</b></td>
    <td>GET, PATCH, DELETE</td>
    <td>User data</td>
  </tr>
  <tr>
    <td><b>/apps/:id/passwords/verify</b></td>
    <td>POST</td>
    <td>User data</td>
  </tr>
  <tr>
    <td><b>/apps/:id/passwords/reset</b></td>
    <td>POST</td>
    <td>User data</td>
  </tr>
  <tr>
    <td><b>/utils/:service/:value?</b></td>
    <td>GET, POST</td>
    <td>Util services</td>
  </tr>
</table>

---

## Project Structure
```bash
├── node_modules/
│   ├── ...  # Directory for third-party packages installed by npm
├── src/
│   ├── db/
│   │   ├── migrations/  # Directory for database migration scripts
│   │   │   ├── ...  
│   │   ├── seeds/  # Directory for database seed data
│   │   │   ├── ...
│   │   ├── index.js  # Main database connection file
│   │   └── knexfile.js  # Knex configuration file
│   ├── middleware/
│   │   ├── auth.js  # Middleware for authentication
│   │   ├── error-handler.js  # Middleware for error handling
│   │   └── passport.js  # Middleware for Passport session-based authentication
│   ├── routes/
│   │   ├── access.js  # Route handler for post-authentication login/logout
│   │   ├── apps.js  # Route handler for app requests
│   │   ├── docs.js  # Route handler for API documentation
│   │   ├── health.js  # Route handler for health check
│   │   ├── index.js  # Main router file
│   │   ├── passwords.js  # Route handler for 2FA processes
│   │   ├── secrets.js  # Route handler for admin-authenticated secrets
│   │   ├── users.js  # Route handler for user requests
│   │   └── utils.js  # Route handler for using utility services {hash, encryption, uuid}
│   ├── services/
│   │   ├── CRUD.js  # Database service for the general CRUD operations (i.e. utils)
│   │   ├── index.js  # Database service for generating and verifying passwords
│   │   ├── passwords.js  # Database service for generating and verifying passwords
│   │   ├── two-factor-auth.js  # 2FA service processes (email/verification)
│   │   └── users.js  # Database service for users
│   ├── aliases.sh  # Shell script with aliases for commonly used commands
│   ├── app.js  # Main application file
│   ├── config.js  # Main configuration file
│   ├── docs.yaml  # API documentation file (Swagger UI)
│   ├── schemas.js  # Data schema validator
│   ├── utils.js  # Utilities (General purpose)
│   └── supabase/  # Directory containing Supabase configuration files
│   │   ├── ...  # Directory for .http files with API endpoints
├── test/
│   ├── ...  # Directory for .http files with API endpoints
├── .env  # Environment variables file
├── .gitignore  # Git ignore file
├── new.env  # Clean environment variables file for new projects
├── package-lock.json  # Lock file for npm packages
├── package.json  # File containing project metadata and npm dependencies
├── README.md  # Project documentation file
└── server.js  # Server entry point file
```

---

## Environment Variables
Rename the `new.env` file to `.env` and add the missing environment variables. If you're authorized, you can find the list of environment variables [here](#environment-variables).

| Name             | Description                        | Default value |
| ---------------- | ---------------------------------- | ------------- |
| PORT             | Server host port                   | 8000 |
| NODE_ENV         | Defines environment                | development | 
| DEV_DB_URL       | Dev DB connection string           | postgresql://postgres:postgres@localhost:54322/postgres |
| PROD_DB_URL      | Prod DB connection string          | none |
| API_KEY          | API Key (Secret)                   | none |
| ADMIN_PASSWORD   | Admin password                     | none |

---

## Authentication
`Passport.js` is used to handle authentication. This is a flexible and modular authentication middleware that allows you to easily add new authentication strategies like login with Facebook, Google, Github, etc. The current setup allows only for a fully manual authentication process that leverages a local strategy using `passport-local`.

The `Passport` configuration and functions are located in `src/middleware/passport.js`.

### Access
The `serializeUser` defines what data are saved in request session, generally we save the user id.

The `deserializeUser` allows getting the whole user object and assigning it in `req.user`, so you can easily get the authenticated user with `req.user`. You don't need to explicitly call `deserializeUser` before calling `req.user`.

> You can find the Passport docs [here](https://www.passportjs.org/).

### Route Protection
To protect a route, you can assign the path to the `authorized` or the `authenticated` auth middlewares within `src/routes/index.js` for the desired level of protection.

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

For more structured logging, the [`pino`](https://www.npmjs.com/package/pino) logging library is leveraged. Similarly, more specific configuration can be set within the `logger` obect in `src/config.js`.

---

## Contributing

Anyone and everyone is welcome to contribute.

For the moment, I have no contributing guidelines. This project has been mainly set up for personal use, but next steps in the roadmap concern making it more accessible and easily usable to the community. As well as establishing

If you want to propose new features, fix a bug or improve the README, don't hesitate to open a pull request. If your changes concern new feature or bugfix, please open an issue before.

---

## License

[MIT](https://opensource.org/license/mit/)
