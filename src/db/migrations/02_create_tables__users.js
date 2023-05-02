const operations = require('../operations');

const apps = ['demo', 'fhp', 'groupgpt'];
const tables = apps.map(app => `${app}__users`);

exports.up = async function (db) {
  await operations.createUsers({ db, apps });
};

exports.down = async function (db) {
  await operations.drop({ db, tables });
};
