const operations = require('../operations');

const app = 'chatterai';

exports.up = async function (db) {
  await operations.createUsers({ db, app });
  await operations.createOrganizations({ db, app });
  await operations.createUserOrganizations({ db, app });
  await operations.createConversations({ db, app });
  await operations.createUserConversations({ db, app });
  await operations.createMessages({ db, app });
  await operations.createRefreshTokens({ db, app });
  await operations.createMFAStorage({ db, app });
};

exports.down = async function (db) {
  const tables = [
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

