const { ADMIN_PASSWORD, OPENAI_API_KEY } = require('../../config');
const Service = require('../../services/DB');

const app = 'demo';
const service = new Service();

exports.seed = async function (db) {
  // Setup
  const admin_password = await service.passwords.hash(
    service.passwords.encrypt(ADMIN_PASSWORD)
  );
  const demo_password = await service.passwords.hash(
    service.passwords.encrypt('password')
  );
  
  // App
  await db('apps').insert([
    {
      id: app,
      name: 'Demo App',
    },
  ]);

  // Users
  await db(`${app}__users`).del();
  await db(`${app}__users`).insert([
    {
      id: 'dio',
      username: 'dio',
      email: 'dionisggr@gmail.com',
      password: admin_password,
      is_admin: true,
      openai_api_key: OPENAI_API_KEY,
    },
    {
      id: 'demo',
      username: 'demo',
      email: 'demo@demo.com',
      password: demo_password,
      is_admin: false,
      openai_api_key: OPENAI_API_KEY,
    },
  ]);

  await db(`${app}__users`).insert([
    { id: 'chatterai' },
    { id: 'chatgpt' },
    { id: 'gpt-4' },
    { id: 'dall-e' },
    { id: 'whisper' },
  ]);

  // Organizations
  await db(`${app}__organizations`).del();
  await db(`${app}__organizations`).insert([
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

  // User Organizations
  await db(`${app}__user_organizations`).del();
  await db(`${app}__user_organizations`).insert([
    {
      user_id: 'demo',
      organization_id: 'demo'
    },
    {
      user_id: 'demo',
      organization_id: 'personal'
    },
    {
      user_id: 'dio',
      organization_id: 'demo'
    },
    {
      user_id: 'dio',
      organization_id: 'personal'
    },
  ]);

  // Conversations
  await db(`${app}__conversations`).del();
  await db(`${app}__conversations`).insert([
    {
      id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
      title: 'Test Title',
      created_by: 'demo',
      organization_id: 'demo',
      type: 'private',
    },
    {
      id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
      title: 'Test Title',
      created_by: 'dio',
      organization_id: 'demo',
      type: 'public',
    },
    {
      id: 'cd3a51f9-b562-46f2-a607-bd11aac1c5dd',
      title: 'Test Title',
      created_by: 'dio',
      organization_id: 'demo',
      type: 'public',
    },
  ]);

  // User Conversations
  await db(`${app}__user_conversations`).del();
  await db(`${app}__user_conversations`).insert([
    {
      conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
      user_id: 'demo',
    },
    {
      conversation_id: 'cd3a51f9-b562-46f2-a607-bd11aac1c5dd',
      user_id: 'dio',
    },
    {
      conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
      user_id: 'dio',
    },
  ]);

  // Messages
  await db(`${app}__messages`).del();
  await db(`${app}__messages`).insert([
    {
      id: '4595a2e8-8024-4e29-b36c-2212d7f242e9',
      content: 'Hi, there',
      user_id: 'demo',
      conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
    },
    {
      id: '77b1c042-168a-4315-a49f-705f9d00dc59',
      content: 'Hi! How can I help?',
      user_id: 'chatgpt',
      conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
    },
    {
      id: '1dbcb23d-ad11-48dc-9076-6fef3d51fe25',
      content: 'Nothing, just saying hi.',
      user_id: 'demo',
      conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
    },
    {
      id: '0f92c484-930e-4175-9e5e-f85bf01b8c0b',
      content: 'Oh, well. Ok! I guess...',
      user_id: 'chatgpt',
      conversation_id: 'bd1151f9-b562-46f2-a607-cd3aaac1c4dd',
    },
    {
      id: '5d285529-a4ce-4b56-ad8e-bb1634afbcc4',
      content: 'Hi there, ChatGPT',
      user_id: 'dio',
      conversation_id: 'cd3a51f9-b562-46f2-a607-bd11aac1c5dd',
    },
    {
      id: 'c8744082-3da4-415c-b368-9fde3ea10009',
      content: 'Who are you?',
      user_id: 'chatgpt',
      conversation_id: 'cd3a51f9-b562-46f2-a607-bd11aac1c5dd',
    },
    {
      id: '6c45f009-5bc5-458b-8f41-3cd884d3312d',
      content: 'I\'m Dio, the super guy!',
      user_id: 'dio',
      conversation_id: 'cd3a51f9-b562-46f2-a607-bd11aac1c5dd',
    },
    {
      id: 'bff7ee6a-6533-46fb-b170-bbf0d63573cb',
      content: 'Well, you do you bring money?',
      user_id: 'chatgpt',
      conversation_id: 'cd3a51f9-b562-46f2-a607-bd11aac1c5dd',
    },
    {
      id: '9500e728-9f38-477e-ac3f-832ac0f8cc8e',
      content: 'Hey there, ChatGPT!',
      user_id: 'dio',
      conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
    },
    {
      id: 'c9d43f98-56e8-4e03-9700-237bfb776901',
      content: 'Now what?',
      user_id: 'chatgpt',
      conversation_id: 'f2936c4c-5e19-4050-bf6a-cfead71fb4eb',
    },
  ]);
};
