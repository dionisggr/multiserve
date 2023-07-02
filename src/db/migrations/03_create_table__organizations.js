const operations = require('../operations');

const apps = ['demo', 'promptwiz'];
const tables = apps.map(app => `${app}__organizations`);

exports.up = async function (db) {
  await operations.createOrganizations({ db, apps });
};

exports.down = async function (db) {
  await operations.drop({ db, tables });
};
