const data = {
  // 'uuid': {
  //   expires: 'timestamp',
  //   [key]: [value],  // Can be any type
  // },
};

function upsert(id, content, expires) {
  const defaultExp = Date.now() + 1000 * 60 * 60;  // 1 hour

  data[id] = {
    expires: expires || defaultExp,
    content,
  };
}

module.exports = { data, upsert };
