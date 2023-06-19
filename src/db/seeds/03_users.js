const Service = require('../../services/DB');
const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  PROMPTWIZ_OPENAI_API_KEY
} = require('../../config');

const service = new Service();
const chat_apps = ['demo', 'promptwiz'];
const apps = [...chat_apps];
const openai_api_keys = {
  'promptwiz': PROMPTWIZ_OPENAI_API_KEY,
}

exports.seed = async function (db) {
  const admin_password = await service.passwords.hash(
    service.passwords.encrypt(ADMIN_PASSWORD)
  );
  const demo_password = await service.passwords.hash(
    service.passwords.encrypt('password')
  );
  
  for (const app of apps) {
    const table = app + '__users';
    
    await db(table).del();
    await db(table).insert([
      {
        id: 'tec3',
        username: 'tec3',
        email: ADMIN_EMAIL,
        password: admin_password,
        is_admin: true,
        organization_id: 'tec3',
        openai_api_key: openai_api_keys[app] || null
      },
      {
        id: 'dio',
        username: 'dio',
        email: 'dionisggr@gmail.com',
        password: admin_password,
        is_admin: true,
        organization_id: 'tec3',
        openai_api_key: openai_api_keys[app] || null
      },
      {
        id: 'lili',
        username: 'lili',
        email: 'lile7886@gmail.com',
        password: admin_password,
        is_admin: true,
        organization_id: 'tec3',
        openai_api_key: openai_api_keys[app] || null
      },
      {
        id: 'doug',
        username: 'doug',
        email: 'briancarter340@gmail.com',
        password: admin_password,
        is_admin: true,
        organization_id: 'tec3',
        openai_api_key: openai_api_keys[app] || null
      },
      {
        id: 'demo',
        username: 'demo',
        email: 'demo@tec3org.com',
        password: demo_password,
        is_admin: false,
        organization_id: 'tec3',
      },
    ]);
  };

  for (const app of chat_apps) {
    const table = app + '__users';

    await db(table).insert([
      { id: 'chatgpt' },
      { id: 'chatgpt4' },
      { id: 'dalle' },
      { id: 'whisper' },
    ]);
  };
};
