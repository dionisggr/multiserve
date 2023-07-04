exports.seed = async function (db) {
  const apps = ['demo', 'promptwiz']

  for (const app of apps) {
    const table = app + '__user_organizations';

    await db(table).del();
    await db(table).insert([
      {
        user_id: 'tec3',
        organization_id: 'tec3'
      },
      {
        user_id: 'demo',
        organization_id: 'demo'
      },
      {
        user_id: 'demo',
        organization_id: 'personal'
      },
    ]);
  };
};
