<h1 align="center">Tec3 API</h1>

## Overview
Tec3 API is a straightforward REST API with authentication written in JavaScript for Node.js backend apps, leveraging Docker, Express, Joi, Knex, Supabase and Passport.

It sets up an Express REST API with Supabase, providing features like Docker containerization, database connection, authentication, error handling, and more. It includes some basic routes for authentication and user creation to simplykickstart most new projects as well.

## Key Features
- [**Docker containerization**](https://www.docker.com/resources/what-container/) to enable easy deployment with no need to install PostgreSQL.
- Session-based authentication provided using [**Passport**](https://www.passportjs.org/).
- Basic security features provided through [**Helmet**](https://helmetjs.github.io/) and [**Cors**](https://github.com/expressjs/cors).
- A strong and reliable relational database included with [**PostgreSQL**](https://www.postgresql.org/).
- A simplified database query builder managed by [**Knex**](https://knexjs.org/).
- Straightforward database migration and seeding strategy with [**Knex**](https://knexjs.org/).
- Custom error handling implemented using [**error-handler**](https://github.com/tec3org/tec3-api/blob/main/src/middleware/error-handler.js).
- A simple and elegant [**Joi**](https://joi.dev/) validation strategy.
- Flexible logging implemented with [**pino**](https://github.com/pinojs/pino).
- Security enhancements thanks to [**bcrypt**](https://github.com/kelektiv/node.bcrypt.js/) hashing and [**crypto**](https://www.npmjs.com/package/crypto-js) encryption.
- Straightforward email management and delivery through with [SendGrid](https://sendgrid.com/).
- WebSocket implementation for real-time server/client bidirectional communication with [**WS**](https://www.npmjs.com/package/ws).
- In-memory data structure store used as database, cache and message broker provided by [**Redis**](https://redis.io/).
- Cron job scheduling and execution for task automation with [**node-cron**](https://www.npmjs.com/package/node-cron).
- Worry-free RFC-compliant unique ID generation with [**uuid**](https://www.npmjs.com/package/uuid).
- OpenAI API integration for text, chat image and audio generation with [**OpenAI**](https://beta.openai.com/).
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
git clone https://github.com/tec3org/tec3-api.git

cd tec3-api
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

You can watch the full API Docs powered by Swagger UI [here](https://tec3-api.up.railway.app/docs). Here is a summary:
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
    <td><b>/apps/:id?</b></td>
    <td>GET</td>
    <td>Apps data</td>
  </tr>
  <tr>
    <td><b>/:app_id/register</b></td>
    <td>POST</td>
    <td>User app registration</td>
  </tr>
  <tr>
    <td><b>/:app_id/login</b></td>
    <td>POST</td>
    <td>User app login</td>
  </tr>
  <tr>
    <td><b>/:app_id/logout</b></td>
    <td>POST</td>
    <td>User app logout</td>
  </tr>
  <tr>
    <td><b>/:app_id/users/:user_id?</b></td>
    <td>GET, PATCH, DELETE</td>
    <td>App user data</td>
  </tr>
  <tr>
    <td><b>/:app_id/passwords/reset</b></td>
    <td>POST</td>
    <td>App user password recovery</td>
  </tr>
  <tr>
    <td><b>/:app_id/passwords/verify</b></td>
    <td>POST</td>
    <td>App 2FA code verification</td>
  </tr>
  <tr>
    <td><b>/utils/:service/:value?</b></td>
    <td>GET, POST</td>
    <td>Util services</td>
  </tr>
  <tr>
    <td><b>/gpt/:prompt?</b></td>
    <td>POST</td>
    <td>GPT (text-davinci-003) completions</td>
  </tr>
  <tr>
    <td><b>/chatgpt</b></td>
    <td>POST</td>
    <td>GPT (gpt-3.5-turbo) chat</td>
  </tr>
  <tr>
    <td><b>/chatgpt4</b></td>
    <td>POST</td>
    <td>GPT (gpt-4) chat</td>
  </tr>
  <tr>
    <td><b>/dalle</b></td>
    <td>POST</td>
    <td>DALL-E model</td>
  </tr>
  <tr>
    <td><b>/whisper</b></td>
    <td>POST</td>
    <td>Whisper model</td>
  </tr>
</table>

---

## Project Structure
```bash
├── node_modules/
│   ├── ...  # Directory for third-party packages installed by npm
├── src/
│   ├── db/
│   │   ├── backups/  # (Local) Directory for database backups
│   │   │   ├── ...  
│   │   ├── migrations/  # Directory for database migration scripts
│   │   │   ├── past/  # Directory for migrations already executed
│   │   │   │   └── ...  ###
│   │   │   ├── ...  
│   │   ├── seeds/  # Directory for database seed data
│   │   │   ├── past/  # Directory for seeds already executed
│   │   │   │   └── ...
│   │   │   ├── ...  
│   │   ├── backup.sh  # Script for backing up the database
│   │   ├── index.js  # Main database connection file
│   │   ├── knexfile.js  # Knex configuration file
│   │   └── operations.js  # General-purpose/Common database operations
│   ├── middleware/
│   │   ├── auth.js  # Middleware for authentication
│   │   ├── error-handler.js  # Middleware for error handling
│   │   └── passport.js  # Middleware for Passport session-based authentication
│   ├── routes/
│   │   ├── grouptgpt/
│   │   │   ├── index.js  # Main GroupGPT app router file
│   │   ├── promptwiz/
│   │   │   ├── index.js  # Main PromptWiz app router file
│   │   │   ├── instructions.js  # Instruction set for PromptWiz app
│   │   ├── access.js  # Route handler for post-authentication login/logout
│   │   ├── AI.js  # Route handler AI (GPT)-related requests
│   │   ├── apps.js  # Route handler for app requests
│   │   ├── docs.js  # Route handler for API documentation
│   │   ├── health.js  # Route handler for health check
│   │   ├── index.js  # Main router file
│   │   ├── messages.js  # Route handler for message requests
│   │   ├── passwords.js  # Route handler for 2FA processes
│   │   ├── secrets.js  # Route handler for admin-authenticated secrets
│   │   ├── users.js  # Route handler for user requests
│   │   └── utils.js  # Route handler for using utility services {hash, encryption, uuid}
│   ├── services/
│   │   ├── AI.js  # AI (GPT) service processes
│   │   ├── backblaze.js  # Cloud file storage service
│   │   ├── cache.js  # Simple local (volatile) cache service
│   │   ├── cron.js  # Cron job scheduling and execution service
│   │   ├── CRUD.js  # General-purpose database service for CRUD operations (utils)
│   │   ├── DB.js  # Database service for data queries
│   │   ├── email.js  # Email generation and communication service
│   │   ├── passwords.js  # Password verification and reset service
│   │   └── two-factor-auth.js  # 2FA service processes (email/verification)
│   ├── aliases.sh  # Shell script with aliases for commonly used commands
│   ├── app.js  # Main application file
│   ├── config.js  # Main configuration file
│   ├── docs.yaml  # API documentation file (Swagger UI)
│   ├── schemas.js  # Data schema validator
│   └── utils.js  # Utilities (General purpose)
├── supabase/  # Directory containing Supabase configuration files
│   ├── ...
├── test/
│   ├── http/  # Directory for .http endpoint test files
│   │   └── ...
│   ├── ...
├── whisper/
│   └── ...  # Directory for placing audio files for Whisper model
├── .env  # Environment variables file
├── .gitignore  # Git ignore file
├── new.env  # Clean environment variables file for new projects
├── package-lock.json  # Lock file for npm packages
├── package.json  # Project metadata and npm dependencies
├── README.md  # Project documentation file
└── server.js  # Server entry point file
```

---

## Environment Variables
Rename the `new.env` file to `.env` and add the missing environment variables. If you're authorized, you can find the list of environment variables [here](#environment-variables).

| Name                 | Description                        | Default value |
| ----------------     | ---------------------------------- | ------------- |
| PORT                 | Server host port                   | 8000 |
| NODE_ENV             | Defines environment                | development | 
| DEV_DB_URL           | Dev DB connection string           | postgresql://postgres:postgres@localhost:54322/postgres |
| PROD_DB_URL          | Prod DB connection string          | none |
| API_KEY              | API Key (Secret)                   | none |
| ADMIN_PASSWORD       | Admin password                     | none |
| SENDGRID_API_KEY     | Email service API key              | none |
| BACKBLAZE_APP_ID     | Storage service location           | none |
| BACKBLAZE_APP_KEY_ID | Storage service authorization      | none |
| BACKBLAZE_BUCKET_ID  | Storage service target             | none |
| OPENAI_API_KEY       | OpenAI Authorization key           | none |

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
