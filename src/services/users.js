const db = require('../../db');
const CRUD = require('./CRUD');
const userApps = require('./user_apps');

const table = 'users';

async function createUser(data) {
  const newUser = await CRUD.create(table, data);

  await userApps.registerUser({ user_id: newUser.id, app_id: 1 });
  
  return newUser;
}

async function getUser({ id, filters, multiple } = {}) {
  if (id) filters = { id, ...filters };

  const columns = ['users.*', db.raw('array_agg(user_apps.app_id) as app_ids')];
  const adjustments = {
    leftJoin: ['user_apps', 'users.id', 'user_apps.user_id'],
    groupBy: ['users.id'],
    filters,
    multiple,
  };

  return await CRUD.read(table, columns, adjustments);
}

async function updateUser({ id, data }) {
  const updated_at = db.fn.now();

  if (!data.last_login) {
    data = { ...data, updated_at };
  }  

  return await CRUD.update(table, id, data);
}

async function deleteUser(id) {
  return await CRUD._delete(table, id);
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
