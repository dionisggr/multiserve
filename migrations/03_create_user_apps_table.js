const { logger } = require("../src/config");

exports.up = async function (db) {
  await db.schema.dropTableIfExists('user_apps');
  await db.schema.createTable('user_apps', function(table) {
    table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('app_id').unsigned().references('id').inTable('apps').onDelete('CASCADE');
  });

  logger.info('Table "user_apps" created successfully!');
};

exports.down = async function(db) {
  await db.schema.dropTableIfExists('user_apps');

  logger.info('Table "user_apps" deleted successfully!');
};
