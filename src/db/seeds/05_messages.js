const apps = ['demo', 'groupgpt'];

exports.seed = async function (db) {
  for (app of apps) {
    const table = app + '__messages';
    
    await db(table).del();
    await db(table).insert([
      {
        id: '3b3e6fb7-5614-4aa9-a1fc-cc9594dcd222',
        content: 'Test Content',
        user_id: '2207d7b2-1559-43a4-8236-470dff0e0356',
        conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
      },
      {
        id: '512dcbdb-51b8-4999-8f84-72bba82db4de',
        content: 'Test Content',
        user_id: '07ffe874-21f0-4805-ad39-7ed440835a8d',
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
      },
      {
        id: 'f6d36aa6-3165-4319-be0b-aebe94306e5c',
        content: 'Test Content',
        user_id: '4c3e475d-1d8e-4c22-8531-042b5e1da77b',
        conversation_id: 'e9a5caad-7b30-4bed-bea9-a718fabcfdcb',
      },
      {
        id: '43cea5c4-074d-4f96-baad-145cd47b27d6',
        content: 'Test Content',
        user_id: 'a698f684-c659-46a1-b77e-c30c33e9c117',
        conversation_id: '104b8cf8-f92f-462d-acc2-ac6d9f8bf338',
      },
      {
        id: '104b8cf8-f92f-462d-acc2-ac6d9f8bf338',
        content: 'Test Content',
        user_id: 'demo',
        conversation_id: '269be190-6475-4969-a55c-c733081120de',
      },
      {
        id: 'abb2fac7-283e-4e20-aff7-47ba2c4d9399',
        content: 'Test Content',
        user_id: 'demo',
        conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
      },
      {
        id: '917a1a4f-4bf4-45b1-8af7-8ee296787870',
        content: 'Another Content',
        user_id: 'demo',
        conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
      },
    ]);
  }
};
