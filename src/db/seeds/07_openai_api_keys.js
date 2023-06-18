const { PROMPTWIZ_OPENAI_API_KEY } = require('../../config');

const apps = ['demo', 'promptwiz'];

exports.seed = async function (db) {
  for (const app of apps) {
    const table = app + '__openai_api_keys';

    await db(table).del();
    await db(table).insert([
      {
        openai_api_key: PROMPTWIZ_OPENAI_API_KEY,
        user_id: 'demo',
        organization_id: 'tec3',
      },
    ]);
  };
};
