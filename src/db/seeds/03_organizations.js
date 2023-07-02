const apps = ['demo', 'promptwiz', 'chatterai']

exports.seed = async function (db) {
  for (const app of apps) {
    const table = app + '__organizations';

    await db(table).del();
    await db(table).insert([
      {
        id: 'tec3',
        name: 'Tec3, LLC',
      },
      {
        id: 'demo',
        name: 'Demo Org.',
      },
      {
        id: 'personal',
        name: 'Personal',
      },
    ]);
  };
};
