const operations = require('../operations');

const app = 'chatterai';

exports.up = async function (db) {
  await operations.createWebSockets({ db, app });
};

exports.down = async function (db) {
  await operations.drop({ db, table: `${app}__websockets` });
};

