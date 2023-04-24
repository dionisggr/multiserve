const table = 'apps';

exports.seed = async function (db) {
  await db(table).del();
  await db(table).insert([
    {
      id: 'fhp',
      name: 'Financial Health Planner',
      created_at: db.fn.now(),
    },
  ]);
};
