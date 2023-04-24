const tables = ['promptwiz__users'];

exports.seed = async function (db) {
  for (let table of tables) {
    await db(table).del();
    await db(table).insert([
      {
        id: "demo",
        username: "demo",
        email: "demo@tec3org.com",
        password: "password",
        is_admin: false,
      },
    ]);
  }
};
