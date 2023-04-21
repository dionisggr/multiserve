const { logger } = require("../src/config");

exports.up = async function (db) {
  await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await db.schema.dropTableIfExists('users');
  await db.schema.createTable("users", function (table) {
    table.uuid("id").primary().defaultTo(db.raw('uuid_generate_v4()'));
    table.string("username").unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("is_admin").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(db.fn.now());
    table.timestamp("updated_at").defaultTo(db.fn.now());
    table.timestamp("last_login").defaultTo(null);
    table.string("avatar").defaultTo(null);
  }).catch(error => logger.error("Error creating table:", error))

  logger.info('Table "users" created successfully!');
};

exports.down = async function (db) {
  await db.schema
    .dropTableIfExists("users")
    .catch(error => logger.error("Error deleting table:", error));
  
  logger.info('Table "users" deleted successfully!');
};
