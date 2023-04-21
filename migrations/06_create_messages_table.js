const { logger } = require("../src/config");

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await db.schema.dropTableIfExists('messages');
  await db.schema.createTable("messages", function (table) {
    table.uuid("id").primary().defaultTo(db.raw('uuid_generate_v4()'));
    table.text("content");
    table.uuid("user_id").unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.uuid("conversation_id").unsigned().references('id').inTable('conversations').onDelete('CASCADE');
    table.timestamp("created_at").defaultTo(db.fn.now());
    table.timestamp("updated_at").defaultTo(db.fn.now());
    table.timestamp("archived_at");

    logger.info('Table "messages" created successfully!');
  }).catch(error => logger.error("Error creating table:", error));
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists("messages")
    .catch(error => logger.error("Error deleting table:", error));

  logger.info('Tables "messages" deleted successfully!');
};
