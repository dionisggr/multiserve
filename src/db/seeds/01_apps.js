exports.seed = async function (db) {
  await db('apps').del();
};
