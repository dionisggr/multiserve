const uuid = require('uuid');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../../config');
const Service = require('../../services');

const service = new Service();
const apps = ['demo', 'fhp', 'gpt'];

exports.seed = async function (db) {
  const admin_password = await service.passwords.hash(
    service.passwords.encrypt(ADMIN_PASSWORD)
  );
  const demo_password = await service.passwords.hash(
    service.passwords.encrypt('password')
  );
  
  for (app of apps) {
    const table = app + '__users';
    await db(table).del();
    await db(table).insert([
      {
        id: uuid.v4(),
        username: 'admin',
        email: ADMIN_EMAIL,
        password: admin_password,
        is_admin: true,
      },
      {
        id: uuid.v4(),
        username: 'dio',
        email: 'dionisggr@gmail.com',
        password: admin_password,
        is_admin: true,
      },
      {
        id: uuid.v4(),
        username: 'lili',
        email: 'lile7886@gmail.com',
        password: admin_password,
        is_admin: true,
      },
      {
        id: uuid.v4(),
        username: 'doug',
        email: 'briancarter340@gmail.com@themy.com',
        password: admin_password,
        is_admin: true,
      },
      {
        id: "demo",
        username: "demo",
        email: "demo@tec3org.com",
        password: demo_password,
        is_admin: false,
      },
    ]);
  }
};
