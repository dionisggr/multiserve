const db = require('../../db');

async function create(table, { data, returning = ['*'] }) {
  return (await db(table)
    .insert(data)
    .returning(returning))[0];
}

async function read(table, adjustments) {
  const {
    filters = true,
    multiple = false,
    columns = ['*'],
    leftJoin,
    rightJoin,
    innerJoin,
    groupBy,
  } = adjustments || {};

  let response = db(table).select(...columns);

  if (leftJoin) response = response.leftJoin(...leftJoin);
  if (rightJoin) response = response.rightJoin(...rightJoin);
  if (innerJoin) response = response.innerJoin(...innerJoin);
  if (filters) response = response.where(filters);
  if (groupBy) response = response.groupBy(...groupBy);

  return await (multiple ? response : response.first());
}

async function update(table, adjustments) {
  const {
    data,
    filters = true,
    multiple = false,
    returning = ['*'],
    leftJoin,
    rightJoin,
    innerJoin,
  } = adjustments || {};

  let response = db(table).update(data);

  if (leftJoin) response = response.leftJoin(...leftJoin);
  if (rightJoin) response = response.rightJoin(...rightJoin);
  if (innerJoin) response = response.innerJoin(...innerJoin);
  if (filters) response = response.where(filters)
  if (returning) response = response.returning(returning)

  response = response.then(rows => rows);
  response = (multiple)
    ? await response.then(rows => rows)
    : await response.then(rows => rows[0]);
  
  return response;
}

async function _delete(table, { filters }) {
  if (!filters) throw new Error('Missing filters to delete.');
  
  return await db(table)
    .where(filters)
    .delete();
}

module.exports = { create, read, update, _delete };
