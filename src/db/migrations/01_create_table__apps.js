const { logger } = require('../../utils');

const tableName = 'apps';

exports.up = async function (db) {
  await db.schema.dropTableIfExists(tableName);
  await db.schema.createTable(tableName, function (table) {
    table.string('id').primary().unique();
    table.string('name').unique();
    table.string("created_at").notNullable().defaultTo(db.fn.now());
    table.string('archived_at').unique();
    table.string('logo').unique();
  }).catch(error => logger.error(error, 'Error creating table.'))

  logger.info(`Table ${tableName} created successfully!`);
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists(tableName)
    .catch(error => logger.error(error, 'Error deleting table.'));
  
  logger.info(`Table ${tableName} deleted successfully!`);
};
