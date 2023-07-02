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
      id: 'promptwiz',
      name: 'PromptWiz',
      created_at: db.fn.now(),
    },
    {
      id: 'chatterai',
      name: 'Chatter AI',
      created_at: db.fn.now(),
    },
    {
      id: 'gpteams',
      name: 'GPTeams',
      created_at: db.fn.now(),
    },
  ]);
};
