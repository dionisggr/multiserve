const CRUD = require('./CRUD');
const apps = require('./apps');

const table = 'user_apps';

async function registerUser(data) {
  const { user_id, app_id } = data;
  const app = await apps.find({ id: app_id });

  if (!app || app.is_archived) {
    const error = createCustomError(`App is archived or does not exist: ${app_id}`, 404);

    throw error;
  }

  const existing = await CRUD.read(table, ['*'], { filters: data });

  if (existing) {
    const error = createCustomError(`User ${user_id} already registered to app: ${app_id}`, 409);

    throw error;
  }

  await CRUD.create(table, data);

  res.sendStatus(201);
};

async function unregisterUser(data) {
  const { user_id, app_id } = data;

  return await CRUD._delete(table, { user_id, app_id });
}

module.exports = { registerUser, unregisterUser };
