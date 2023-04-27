const table = 'apps';

exports.seed = async function (db) {
  await db(table).del();
  await db(table).insert([
    {
      id: 'demo',
      name: 'Mock Demo App',
      created_at: db.fn.now(),
    },
    {
      id: 'baseport',
      name: 'Baseport',
      created_at: db.fn.now(),
    },
    {
      id: 'promptwiz',
      name: 'PromptWiz',
      created_at: db.fn.now(),
    },
  ]);
};
