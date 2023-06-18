const { logger } = require('../../utils');

const tableName = 'organizations';

exports.up = async function (db) {
  await db.schema.dropTableIfExists(tableName);
  await db.schema.createTable(tableName, function (table) {
    table.string('id').primary();
    table.string('name');
    table.string("created_at").defaultTo(db.fn.now());
    table.string('archived_at').defaultTo(db.fn.now());
    table.string('logo').unique();
    table.string('app_id').references('id').inTable('apps').onDelete('CASCADE');
  }).catch(error => logger.error(error, 'Error creating table.'))

  logger.info(`Table ${tableName} created successfully!`);
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists(tableName)
    .catch(error => logger.error(error, 'Error deleting table.'));
  
  logger.info(`Table ${tableName} deleted successfully!`);
};
