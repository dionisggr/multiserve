const operations = require('../operations');

const app = 'gpt';
const table = `${app}__conversations`;

exports.up = async function (db) {
  await operations.createConversations({ db, app });
};

exports.down = async function (db) {
  await operations.drop({ db, table });
};
