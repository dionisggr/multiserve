const { logger } = require('../utils');

async function createUsers({ db, app, apps }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__users`;

    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
      table.string('username').unique();
      table.string('password');
      table.string('first_name');
      table.string('last_name');
      table.date('DOB');
      table.string('email').unique();
      table.string('phone').unique();
      table.string('avatar').unique();
      table.string('openai_api_key');
      table.boolean('is_admin').notNullable().defaultTo(false);
      table.boolean('is_google').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
      table.timestamp('last_login').defaultTo(db.fn.now());
    })
    .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
};

async function createOrganizations({ db, app, apps }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__organizations`;
    
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
      table.string('name');
      table.string('created_by').references('id').inTable(`${appName}__users`).onDelete('CASCADE');
      table.string("created_at").defaultTo(db.fn.now());
      table.string('archived_at').defaultTo(db.fn.now());
      table.string('logo').unique();
    }).catch(error => logger.error(error, 'Error creating table.'))

    logger.info(`Table ${tableName} created successfully!`);
  }
};

async function createUserOrganizations({ db, apps, app }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__user_organizations`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('user_id').references('id').inTable(`${appName}__users`).onDelete('CASCADE');
      table.string('organization_id').references('id').inTable(`${appName}__organizations`).onDelete('CASCADE');
    }).catch(error => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  };
}

async function createConversations({ db, apps, app }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__conversations`;

    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
        table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
        table.string('title');
        table.string('created_by').references('id').inTable(`${appName}__users`).onDelete('CASCADE');
        table.string('organization_id').references('id').inTable(`${appName}__organizations`).onDelete('CASCADE');
        table.string('type').defaultTo('private');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        table.timestamp('archived_at');
      })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createMessages({ db, apps, app }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__messages`;

    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
      table.string('conversation_id').references('id').inTable(`${appName}__conversations`).onDelete('CASCADE');
      table.string('archived_by').nullable().references('id').inTable(`${appName}__messages`).onDelete('SET NULL');
      table.string('user_id').nullable().references('id').inTable(`${appName}__users`).onDelete('CASCADE');
      table.string('type');
      table.specificType('content', 'varchar').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at');
      table.timestamp('archived_at');
    })
    .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createUserConversations({ db, apps, app }) {
  for (const appName of apps || [app])  {
    const tableName = `${appName}__user_conversations`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
        table.string('user_id').references('id').inTable(`${appName}__users`).onDelete('CASCADE');
        table.string('conversation_id').references('id').inTable(`${appName}__conversations`).onDelete('CASCADE');
      })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createRefreshTokens({ db, apps, app }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__refresh_tokens`;
    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.text('token').primary();
      table.string('user_id').references('id').inTable(`${appName}__users`).onDelete('CASCADE');
    })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createMFAStorage({ db, apps, app }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__mfa`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
      table.string('code').notNullable();
      table.string('email');
    })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createInvites({ db, apps, app }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__invites`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('token');
      table.string('email');
      table.string('sender').references('id').inTable(`${appName}__users`).onDelete('CASCADE');
      table.string('organization_id').references('id').inTable(`${appName}__organizations`).onDelete('CASCADE');
    })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function createWebSockets({ db, apps, app }) {
  for (const appName of apps || [app]) {
    const tableName = `${appName}__websockets`;

    await db.schema.dropTableIfExists(tableName);
    await db.schema.createTable(tableName, function (table) {
      table.string('ws').primary();
      table.string('user_id').references('id').inTable(`${appName}__users`).onDelete('CASCADE');
      table.string('conversation_id').references('id').inTable(`${appName}__conversations`).onDelete('CASCADE');
      table.boolean('is_online').defaultTo(false);
      table.boolean('is_typing').defaultTo(false);
    })
      .catch((error) => logger.error(error, 'Error creating table.'));

    logger.info(`Table ${tableName} created successfully!`);
  }
}

async function drop({ db, tables, table }) {
  for (const tableName of tables || [table]) {
    await db.schema
      .dropTableIfExists(tableName)
      .catch((error) => logger.error(error, 'Error deleting table.'));

    logger.info(`Table ${tableName} deleted successfully!`);
  }
}

module.exports = {
  createOrganizations,
  createUserOrganizations,
  createUsers,
  createConversations,
  createUserConversations,
  createMessages,
  createRefreshTokens,
  createMFAStorage,
  createInvites,
  createWebSockets,
  drop,
};
