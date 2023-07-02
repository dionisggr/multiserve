const operations = require('../operations');

const apps = ['demo', 'promptwiz'];
const tables = apps.map(app => `${app}__user_organizations`);

exports.up = async function (db) {
  await operations.createUserOrganizations({ db, apps });
};

exports.down = async function (db) {
  await operations.drop({ db, tables });
};
