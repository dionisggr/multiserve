const { logger } = require('../src/config');

const name = 'promptwiz__users';

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await db.schema.dropTableIfExists(name);
  await db.schema.createTable(name, function (table) {
    table.uuid('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
    table.string('username').unique();
    table.string("password").notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').unique();
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp("updated_at").defaultTo(db.fn.now());
    table.timestamp("last_login").defaultTo(db.fn.now());
    table.string("avatar").defaultTo(null);
  }).catch(error => logger.error(error, 'Error creating table.'))

  logger.info(`Table ${name} created successfully!`);
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists(table)
    .catch(error => logger.error(error, 'Error deleting table.'));
  
  logger.info(`Table ${name} deleted successfully!`);
};
