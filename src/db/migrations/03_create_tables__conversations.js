const operations = require('../operations');

const apps = ['demo', 'gpteams', 'groupgpt'];
const tables = apps.map(app => `${app}__conversations`);

exports.up = async function (db) {
  await operations.createConversations({ db, apps });
};

exports.down = async function (db) {
  await operations.drop({ db, tables });
};
