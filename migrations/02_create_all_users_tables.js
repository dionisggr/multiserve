const { logger } = require('../src/config');

const apps = ['tec3', 'fhp']

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  for (app of apps) {
    const tableName = `${app}__users`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
      table.string('username').unique();
      table.string("password").notNullable();
      table.string('first_name');
      table.string('last_name');
      table.date('DOB');
      table.string('email').notNullable().unique();
      table.string('phone').unique();
      table.string("avatar").unique();
      table.boolean('is_admin').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
      table.timestamp("last_login").defaultTo(db.fn.now());
    }).catch(error => logger.error(error, 'Error creating table.'))

    logger.info(`Table ${tableName} created successfully!`);
  }
};

exports.down = async function (db) {
  for (app of apps) {
    const tableName = `${app}__users`;

    await db.schema
    .dropTableIfExists(tableName)
    .catch(error => logger.error(error, 'Error deleting table.'));
  
  logger.info(`Table ${tableName} deleted successfully!`);
  }
};
