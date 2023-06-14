const { logger } = require('../../utils');

const tableName = 'apps';

exports.up = async function (db) {
  await db.schema.dropTableIfExists(tableName);
  await db.schema.createTable(tableName, function (table) {
    table.string('id').primary();
    table.string('name');
    table.string('logo');
    table.timestamp("created_at").defaultTo(db.fn.now());
    table.timestamp('archived_at').defaultTo(db.fn.now());
  }).catch(error => logger.error(error, 'Error creating table.'))

  logger.info(`Table ${tableName} created successfully!`);
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists(tableName)
    .catch(error => logger.error(error, 'Error deleting table.'));
  
  logger.info(`Table ${tableName} deleted successfully!`);
};
