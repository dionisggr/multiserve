const { logger } = require("../src/config");

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await db.schema.dropTableIfExists('conversation_messages');
  await db.schema.createTable('conversation_messages', function (table) {
    table.uuid('conversation_id').unsigned().references('id').inTable('conversations').onDelete('CASCADE');
    table.uuid('message_id').unsigned().references('id').inTable('messages').onDelete('CASCADE');
  });

  logger.info('Table "conversation_messages" created successfully!');
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists("conversation_messages")
    .catch(error => logger.error("Error deleting table:", error));

  logger.info('Tables "conversation_messages" deleted successfully!');
};
