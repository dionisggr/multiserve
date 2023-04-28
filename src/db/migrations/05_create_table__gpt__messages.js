const operations = require('../operations');

const app = 'gpt';
const table = `${app}__messages`;

exports.up = async function (db) {
  await operations.createMessages({ db, app });
};

exports.down = async function (db) {
  await operations.drop({ db, table });
};
