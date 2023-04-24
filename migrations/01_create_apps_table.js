const { logger } = require('../src/config');

const name = 'apps';

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await db.schema.dropTableIfExists(name);
  await db.schema.createTable(name, function (table) {
    table.uuid('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
    table.string('name').unique();
    table.string("created_at").notNullable();
    table.string('archived_at').notNullable().unique();
    table.string('logo').notNullable().unique();
  }).catch(error => logger.error(error, 'Error creating table.'))

  logger.info(`Table ${name} created successfully!`);
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists(table)
    .catch(error => logger.error(error, 'Error deleting table.'));
  
  logger.info(`Table ${name} deleted successfully!`);
};
