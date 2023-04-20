const db = require('../../db');

async function create(table, data) {
  return await db(table)
    .insert(data)
    .returning('*')
}

async function read(table, columns = ['*'], adjustments) {
  const {
    multiple = false,
    filters = true,
    leftJoin,
    rightJoin,
    groupBy
  } = adjustments || {};
  const response = db(table).select(...columns)

  if (leftJoin) response.leftJoin(...leftJoin);
  if (rightJoin) response.rightJoin(...rightJoin);
  if (filters) response.where(filters);
  if (groupBy) response.groupBy(...groupBy);

  if (multiple) {
    return await response;
  } else {
    return await response.first();
  }
}

async function update(table, id, data) {
  return await db(table)
    .where({ id })
    .update(data)
    .returning('*')
}

async function _delete(table, id) {
  return await db(table)
    .where({ id })
    .delete()
}

module.exports = { create, read, update, _delete };
