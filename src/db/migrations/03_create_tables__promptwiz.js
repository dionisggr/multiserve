const operations = require('../operations');

const app = 'promptwiz';

exports.up = async function (db) {
  await operations.createUsers({ db, app });
  await operations.createOrganizations({ db, app });
  await operations.createUserOrganizations({ db, app });
  await operations.createConversations({ db, app });
  await operations.createUserConversations({ db, app });
  await operations.createMessages({ db, app });
  await operations.createRefreshTokens({ db, app });
  await operations.createMFAStorage({ db, app });

  await db.schema.createTable(`${app}__prompts`, function (table) {
    table.string('id').primary().defaultTo(db.raw('uuid_generate_v4()'));
    table.string('title');
    table.text('prompt').notNullable();
    table.string('model').notNullable();
    table.string("created_at").defaultTo(db.fn.now());
    table.string('user_id').notNullable().references('id').inTable(`${app}__users`).onDelete('CASCADE');
  });
};

exports.down = async function (db) {
  const tables = [
    'prompts',
    'mfa',
    'refresh_tokens',
    'messages',
    'user_conversations',
    'conversations',
    'user_organizations',
    'organizations',
    'users',
  ].map((table) => `${app}__${table}`);

  await operations.drop({ db, tables });
};
