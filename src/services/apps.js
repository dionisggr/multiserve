const CRUD = require('./CRUD');

const table = 'apps';

async function find({ id, multiple }) {
  const adjustments = (id) ? { id } : { multiple };

  return await CRUD.read(table, ['*'], adjustments);
}

module.exports = { find };
