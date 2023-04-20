require('dotenv').config();

const { NODE_ENV, DEV_DB_URL, PROD_DB_URL } = process.env;
const config = {
  development: {
    client: 'postgresql',
    connection: DEV_DB_URL,
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'postgresql',
    connection: PROD_DB_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  }
}

module.exports = config[NODE_ENV];
