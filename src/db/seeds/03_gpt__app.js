exports.seed = async function (db) {
  const table = 'apps';

  await db(table).del()
  await db(table).insert([
    {
      id: 'gpt',
      name: 'GPT',
      created_at: db.fn.now(),
    },
  ]);
};
