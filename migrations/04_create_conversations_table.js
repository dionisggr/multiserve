const { logger } = require("../src/config");

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await db.schema.dropTableIfExists('conversations');
  await db.schema.createTable("conversations", function (table) {
    table.uuid("id").primary().defaultTo(db.raw('uuid_generate_v4()'));
    table.string("title");
    table.uuid("app_id");
    table.timestamp("created_at").defaultTo(db.fn.now());
    table.timestamp("updated_at").defaultTo(db.fn.now());
    table.timestamp("archived_at");

    logger.info('Table "conversations" created successfully!');
  }).catch(error => logger.error("Error creating table:", error));
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists("conversations")
    .catch(error => logger.error("Error deleting table:", error));

  logger.info('Tables "conversations" deleted successfully!');
};