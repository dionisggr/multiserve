const operations = require('../operations');
const { logger } = require('../../utils');

const tableName = 'promptwiz__prompts';

exports.up = async function (db) {
  await db.schema.dropTableIfExists(tableName);
  await db.schema.createTable(tableName, function (table) {
    table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
    table.string('title');
    table.text('prompt').notNullable();
    table.string('model').notNullable();
    table.string("created_at").defaultTo(db.fn.now());
    table.string('user_id').notNullable().references('id').inTable('promptwiz__users').onDelete('CASCADE');
  })
    .catch((error) => logger.error(error, 'Error creating table.'));

  logger.info(`Table ${tableName} created successfully!`);
};

exports.down = async function (db) {
  await operations.drop({ db, table: tableName });

  logger.info('Table deleted successfully: ' + tableName);
};
