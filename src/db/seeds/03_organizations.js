exports.seed = async function (db) {
  const apps = ['demo', 'promptwiz']

  for (const app of apps) {
    const table = app + '__organizations';

    await db(table).del();
    await db(table).insert([
      {
        id: 'tec3',
        name: 'Tec3, LLC',
        created_by: 'tec3',
      },
      {
        id: 'demo',
        name: 'Demo Org.',
        created_by: 'demo',
      },
      {
        id: 'personal',
        name: 'Personal',
        created_by: 'demo',
      },
    ]);
  };
};