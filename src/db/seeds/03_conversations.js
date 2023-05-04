const apps = ['demo', 'gpteams', 'groupgpt'];

exports.seed = async function (db) {
  for (app of apps) {
    const table = app + '__conversations';
    
    await db(table).del();
    await db(table).insert([
      {
        id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        title: 'Test Title',
        created_by: '2207d7b2-1559-43a4-8236-470dff0e0356',
      },
      {
        id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        title: 'Test Title',
        created_by: '07ffe874-21f0-4805-ad39-7ed440835a8d',
      },
      {
        id: 'e9a5caad-7b30-4bed-bea9-a718fabcfdcb',
        title: 'Test Title',
        created_by: '4c3e475d-1d8e-4c22-8531-042b5e1da77b',
      },
      {
        id: '104b8cf8-f92f-462d-acc2-ac6d9f8bf338',
        title: 'Test Title',
        created_by: 'a698f684-c659-46a1-b77e-c30c33e9c117',
      },
      {
        id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
        title: 'Test Title',
        created_by: 'a698f684-c659-46a1-b77e-c30c33e9c117',
      },
      {
        id: '269be190-6475-4969-a55c-c733081120de',
        title: 'Test Title',
        created_by: 'demo',
      },
    ]);
  }
};
