const CRUD = require('./CRUD');

const table = 'apps';

async function find({ id, multiple }) {
  const adjustments = { multiple };

  if (id) adjustments.filters = { id };

  return await CRUD.read(table, ['*'], adjustments);
}

module.exports = { find };
