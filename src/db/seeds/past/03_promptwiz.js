const { ADMIN_EMAIL, ADMIN_PASSWORD, PROMPTWIZ_OPENAI_API_KEY } = require('../../config');
const Service = require('../../services/DB');

const app = 'promptwiz';
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
      name: 'PromptWiz',
    },
  ]);

  // Users
  await db(`${app}__users`).del();
  await db(`${app}__users`).insert([
    {
      id: 'tec3',
      username: 'tec3',
      email: ADMIN_EMAIL,
      password: admin_password,
      is_admin: true,
      openai_api_key: PROMPTWIZ_OPENAI_API_KEY,
    },
    {
      id: 'dio',
      username: 'dio',
      email: 'dionisggr@gmail.com',
      password: admin_password,
      is_admin: true,
      openai_api_key: PROMPTWIZ_OPENAI_API_KEY,
    },
    {
      id: 'lili',
      username: 'lili',
      email: 'lile7886@gmail.com',
      password: admin_password,
      is_admin: true,
      openai_api_key: PROMPTWIZ_OPENAI_API_KEY,
    },
    {
      id: 'doug',
      username: 'doug',
      email: 'briancarter340@gmail.com',
      password: admin_password,
      is_admin: true,
      openai_api_key: PROMPTWIZ_OPENAI_API_KEY,
    },
    {
      id: 'demo',
      username: 'demo',
      email: 'demo@demo.com',
      password: demo_password,
      is_admin: false,
      openai_api_key: PROMPTWIZ_OPENAI_API_KEY,
    },
  ]);

  await db(`${app}__users`).insert([
    { id: 'chatterai' },
    { id: 'chatgpt' },
    { id: 'gpt-4' },
    { id: 'dall-e' },
    { id: 'whisper' },
  ]);

  // Prompts
  await db(`${app}__prompts`).del();
  await db(`${app}__prompts`).insert([
    {
      id: '77b1c042-168a-4315-a49f-705f9d00dc59',
      title: 'Prompt Title 1',
      prompt: '1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies.',
      user_id: 'demo',
      model: 'chatgpt'
    },
    {
      id: '1dbcb23d-ad11-48dc-9076-6fef3d51fe25',
      title: 'Prompt Title 2',
      prompt: '2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies.',
      user_id: 'demo',
      model: 'chatgpt'
    },
    {
      id: '5d285529-a4ce-4b56-ad8e-bb1634afbcc4',
      title: 'Prompt Title 3',
      prompt: '3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies.',
      user_id: 'demo',
      model: 'chatgpt'
    },
  ]);
};
