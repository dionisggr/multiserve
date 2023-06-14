const apps = ['demo'];

exports.seed = async function (db) {
  for (const app of apps) {
    const table = app + '__messages';
    
    await db(table).del();
    await db(table).insert([
      {
        id: '4595a2e8-8024-4e29-b36c-2212d7f242e9',
        content: 'Hi, there',
        user_id: 'demo',
        conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        organization_id: 'tec3',
      },
      {
        id: '77b1c042-168a-4315-a49f-705f9d00dc59',
        content: 'Hi! How can I help?',
        user_id: 'chatgpt',
        conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        organization_id: 'tec3',
      },
      {
        id: '1dbcb23d-ad11-48dc-9076-6fef3d51fe25',
        content: 'Nothing, just saying hi.',
        user_id: 'demo',
        conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        organization_id: 'tec3',
      },
      {
        id: '0f92c484-930e-4175-9e5e-f85bf01b8c0b',
        content: 'Oh, well. Ok! I guess...',
        user_id: 'chatgpt',
        conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
        organization_id: 'tec3',
      },
      {
        id: '5d285529-a4ce-4b56-ad8e-bb1634afbcc4',
        content: 'Hi there, ChatGPT',
        user_id: 'doug',
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        organization_id: 'tec3',
      },
      {
        id: 'c8744082-3da4-415c-b368-9fde3ea10009',
        content: 'Who are you?',
        user_id: 'chatgpt',
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        organization_id: 'tec3',
      },
      {
        id: '6c45f009-5bc5-458b-8f41-3cd884d3312d',
        content: 'I\'m Doug, the CFO!',
        user_id: 'doug',
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        organization_id: 'tec3',
      },
      {
        id: 'bff7ee6a-6533-46fb-b170-bbf0d63573cb',
        content: 'Well, you do you bring money?',
        user_id: 'chatgpt',
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        organization_id: 'tec3',
      },
      {
        id: 'bff7ee6a-6533-46fb-b170-bbf0d73573cb',
        content: 'Play nice, ChatGPT.',
        user_id: 'lili',
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        organization_id: 'tec3',
      },
      {
        id: 'bff7ee6a-6533-47fb-b170-bbf0d73573cb',
        content: 'Pfff.',
        user_id: 'chatgpt',
        conversation_id: '65ca9c07-cdb6-48e9-8731-7cc7503cdb30',
        organization_id: 'tec3',
      },
      {
        id: '9500e728-9f38-477e-ac3f-832ac0f8cc8e',
        content: 'Hey there, ChatGPT!',
        user_id: 'doug',
        conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
        organization_id: 'tec3',
      },
      {
        id: 'c9d43f98-56e8-4e03-9700-237bfb776901',
        content: 'Now what?',
        user_id: 'chatgpt',
        conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
        organization_id: 'tec3',
      },
    ]);
  };
};
