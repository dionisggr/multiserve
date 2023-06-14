const operations = require('../operations');

const apps = ['demo'];
const tables = apps.map(app => `${app}__user_conversations`);

exports.up = async function (db) {
  await operations.createUserConversations({ db, apps });
};

exports.down = async function (db) {
  await operations.drop({ db, tables });
};