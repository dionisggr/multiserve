const data = {
  // 'uuid': {
  //   expires: 'timestamp',
  //   [key]: [value],  // Can be any type
  // },
};

function upsert(id, entry) {
  const expires = Date.now() + 1000 * 60 * 60;  // 1 hour

  data[id] = { ...entry, expires };
}

module.exports = { data, upsert };
