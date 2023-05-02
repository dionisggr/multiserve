const table = 'apps';

exports.seed = async function (db) {
  await db(table).del();
  await db(table).insert([
    {
      id: 'demo',
      name: 'Demo App',
      created_at: db.fn.now(),
    },
    {
      id: 'fhp',
      name: 'Financial Health Planner',
      created_at: db.fn.now(),
    },
    {
      id: 'groupgpt',
      name: 'groupgpt',
      created_at: db.fn.now(),
    },
  ]);
};
