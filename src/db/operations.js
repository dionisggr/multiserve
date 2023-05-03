const { logger } = require('../config');

async function createUsers({ db, app, apps }) {
  for (appName of (apps || [app])) {
    const tableName = `${appName}__users`;

    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
        table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
        table.string('username').unique();
        table.string('password').notNullable();
        table.string('first_name');
        table.string('last_name');
        table.date('DOB');
        table.string('email').notNullable().unique();
        table.string('phone').unique();
        table.string('avatar').unique();
        table.boolean('is_admin').notNullable().defaultTo(false);
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        table.timestamp('last_login').defaultTo(db.fn.now());
      })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createConversations({ db, apps, app }) {
  for (appName of (apps || [app])) {
    const tableName = `${appName}__conversations`;

    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
        table.uuid('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
        table.string('title').notNullable();
        table.string('created_by').unsigned().references('id').inTable(`${appName}__users`).onDelete('CASCADE');
        table.enum('type', ['single', 'group']).defaultTo('single');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        table.timestamp('archived_at');
      })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createMessages({ db, apps, app }) {
  for (appName of (apps || [app])) {
    const tableName = `${appName}__messages`;

    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.uuid('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
      table.uuid('conversation_id').unsigned().references('id').inTable(`${appName}__conversations`).onDelete('CASCADE');
      table.uuid('archived_by').unsigned().nullable().references('id').inTable(`${appName}__messages`).onDelete('SET NULL');
      table.string('content').notNullable();
      table.string('user_id').unsigned().references('id').inTable(`${appName}__users`).onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
      table.timestamp('archived_at');
    })
    .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createUserConversations({ db, apps, app }) {
  for (appName of (apps || [app])) {
    const tableName = `${appName}__user_conversations`;

    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
        table.string('user_id').unsigned().references('id').inTable(`${appName}__users`).onDelete('CASCADE');
        table.uuid('conversation_id').unsigned().references('id').inTable(`${appName}__conversations`).onDelete('CASCADE');
      })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function drop({ db, tables, table }) {
  for (tableName of (tables || [table])) {
    await db.schema
      .dropTableIfExists(tableName)
      .catch((error) => logger.error(error, 'Error deleting table.'));

    logger.info(`Table ${tableName} deleted successfully!`);
  }
}

module.exports = {
  createUsers,
  createConversations,
  createUserConversations,
  createMessages,
  drop,
};
