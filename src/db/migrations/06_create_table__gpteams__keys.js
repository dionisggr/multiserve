const { logger } = require('../../config');

const keys = 'gpteams__keys';
const users = 'gpteams__users';

exports.up = async function (db) {
  await db.schema.alterTable(users, (table) => {
    table.string('slack_team_id').unique();
    table.string('password');
    table.string('email').unique();
  });

  await db.schema.dropTableIfExists(keys);
  await db.schema.createTable(keys, function (table) {
    table.string('slack_user_id').unsigned().references('slack_user_id').inTable(users).onDelete('CASCADE');
    table.string('slack_team_id').unsigned().references('slack_team_id').inTable(users).onDelete('CASCADE');
    table.string("openai_api_key").notNullable();
  }).catch(error => logger.error(error, 'Error creating table.'));

  logger.info(`Table ${keys} created successfully!`);
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists(keys)
    .catch(error => logger.error(error, 'Error deleting table.'));
  
  logger.info(`Table ${keys} deleted successfully!`);
};
