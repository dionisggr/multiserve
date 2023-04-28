const operations = require('../operations');

const app = 'gpt';
const table = `${app}__user_conversations`;

exports.up = async function (db) {
  await operations.createUserConversations({ db, app });
};

exports.down = async function (db) {
  await operations.drop({ db, table });
};