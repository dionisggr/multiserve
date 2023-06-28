const operations = require('../operations');

const app = 'chatterai';

exports.up = async function (db) {
  await operations.createUsers({ db, app });
  await operations.createConversations({ db, app });
  await operations.createMessages({ db, app });
  await operations.createUserConversations({ db, app });
  await operations.createRefreshTokens({ db, app });
  await operations.createMFAStorage({ db, app });
};

exports.down = async function (db) {
  const tables = [
    'users',
    'conversations',
    'user_conversations',
    'messages',
    'refresh_tokens',
    'mfa'
  ].map((table) => `${app}__${table}`);

  await operations.drop({ db, tables });
};

