const app = 'gpt';

exports.seed = async function (db) {
  const table = app + '__user_conversations';
  await db(table).del();
  await db(table).insert([
    {
      conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
      user_id: '2207d7b2-1559-43a4-8236-470dff0e0356',
    },
    {
      conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
      user_id: '07ffe874-21f0-4805-ad39-7ed440835a8d',
    },
    {
      conversation_id: 'e9a5caad-7b30-4bed-bea9-a718fabcfdcb',
      user_id: '4c3e475d-1d8e-4c22-8531-042b5e1da77b',
    },
    {
      conversation_id: '104b8cf8-f92f-462d-acc2-ac6d9f8bf338',
      user_id: 'a698f684-c659-46a1-b77e-c30c33e9c117',
    },
    {
      conversation_id: '269be190-6475-4969-a55c-c733081120de',
      user_id: 'demo',
    },
  ]);
};
