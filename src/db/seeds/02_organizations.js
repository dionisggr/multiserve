const table = 'demo__organizations';

exports.seed = async function (db) {
  await db(table).del();
  await db(table).insert([
    {
      id: 'tec3',
      name: 'Demo Organization',
      app_id: 'demo',
    },
  ]);
};
