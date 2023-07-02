const apps = ['demo', 'chatterai'];

exports.seed = async function (db) {
  for (const app of apps) {
    const table = app + '__conversations';

    await db(table).del();
    await db(table).insert([
      {
        id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        title: 'Test Title',
        created_by: app,
        organization_id: 'demo',
        type: 'private',
      },
      {
        id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
        title: 'Test Title',
        created_by: 'doug',
        organization_id: 'demo',
        type: 'public',
      },
      {
        id: 'cd3a51f9-b562-46f2-a607-bd11aac1c5dd',
        title: 'Test Title',
        created_by: 'doug',
        organization_id: 'demo',
        type: 'public',
      },
      {
        id: '46f251f9-b562-cd3a-a607-bd11aac1c5dd',
        title: 'Test Title',
        created_by: 'lili',
        organization_id: 'demo',
        type: 'private',
      },
    ]);
  };
};
