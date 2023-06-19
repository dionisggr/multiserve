const { logger } = require('../../utils');
const operations = require('../operations');

const apps = ['demo', 'promptwiz'];

exports.up = async function (db) {
  for (const app of apps) {
    const tableName = `${app}__openai_api_keys`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('openai_api_key', 255).primary();
      table.string('user_id').references('id').inTable(`${app}__users`).onDelete('CASCADE');
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
};

exports.down = async function (db) {
  const tables = apps.map((app) => `${app}__openai_api_keys`);
  
  await operations.drop({ db, tables });

  logger.info('Tables deleted successfully: ' + tables.join(', '));
};
