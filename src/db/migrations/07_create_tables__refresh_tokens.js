const { logger } = require('../../utils');
const operations = require('../operations');

const apps = ['demo'];
const tables = apps.map((app) => `${app}__refresh_tokens`);

exports.up = async function (db) {
  for (const app of apps) {
    const tableName = `${app}__refresh_tokens`;
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.text('token').primary();
      table.string('user_id').unsigned().references('id').inTable(`${app}__users`).onDelete('CASCADE');
    })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
};

exports.down = async function (db) {
  await operations.drop({ db, tables });

  logger.info('Tables deleted successfully: ' + tables.join(', '));
};
