const { logger } = require('../../utils');
const operations = require('../operations');

const apps = ['demo', 'promptwiz'];

exports.up = async function (db) {
  for (const app of apps) {
    const tableName = `${app}__mfa`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
      table.string('code').notNullable();
      table.string('email');
    })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
};

exports.down = async function (db) {
  const tables = apps.map((app) => `${app}__mfa`);
  
  await operations.drop({ db, tables });

  logger.info('Tables deleted successfully: ' + tables.join(', '));
};
