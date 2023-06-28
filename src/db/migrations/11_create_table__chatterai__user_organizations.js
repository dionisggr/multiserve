const { logger } = require('../../utils');

const tableName = 'chatterai__user_organizations';

exports.up = async function (db) {
  await db.schema.dropTableIfExists(tableName);
  await db.schema.createTable(tableName, function (table) {
    table.string('user_id').references('id').inTable('chatterai__users').onDelete('CASCADE');
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
