const apps = ['demo'];

exports.seed = async function (db) {
  for (const app of apps) {
    const table = app + '__conversations';

    await db(table).del();
    await db(table).insert([
      {
        id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        title: 'Test Title',
        created_by: 'demo',
        organization_id: 'tec3',
      },
      {
        id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        title: 'Test Title',
        created_by: 'demo',
        organization_id: 'tec3',
      },
      {
        id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
        title: 'Test Title',
        created_by: 'doug',
        organization_id: 'tec3',
      },
    ]);
  };
};
