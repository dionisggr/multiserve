const apps = ['demo'];

exports.seed = async function (db) {
  for (const app of apps) {
    const table = app + '__user_conversations';
    
    await db(table).del();
    await db(table).insert([
      {
        conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        user_id: 'demo',
      },
      {
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        user_id: 'demo',
      },
      {
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        user_id: 'doug',
      },
      {
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        user_id: 'lili',
      },
      {
        conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
        user_id: 'doug',
      },
    ]);
  };
};
