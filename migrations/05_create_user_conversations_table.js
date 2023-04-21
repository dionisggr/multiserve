const { logger } = require("../src/config");

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await db.schema.dropTableIfExists('user_conversations');
  await db.schema.createTable('user_conversations', function (table) {
    table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('conversation_id').unsigned().references('id').inTable('conversations').onDelete('CASCADE');
  });

  logger.info('Table "user_conversations" created successfully!');
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists("user_conversations")
    .catch(error => logger.error("Error deleting table:", error));

  logger.info('Tables "user_conversations" deleted successfully!');
};
