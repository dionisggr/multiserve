const uuid = require('uuid');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../../config');
const Service = require('../../services');

exports.seed = async function (db) {
  const service = new Service();
  const admin_password = await service.passwords.hash(
    service.passwords.encrypt(ADMIN_PASSWORD)
  );
  const demo_password = await service.passwords.hash(
    service.passwords.encrypt('password')
  );

  const table = 'gpt__users';
  await db(table).del();
  await db(table).insert([
    {
      id: 'admin',
      username: 'admin',
      email: ADMIN_EMAIL,
      password: admin_password,
      is_admin: true,
    },
    {
      id: 'dio',
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
      email: 'briancarter340@gmail.com',
      password: admin_password,
      is_admin: true,
    },
    {
      id: 'demo',
      username: 'demo',
      email: 'demo@tec3org.com',
      password: demo_password,
      is_admin: true,
    },
  ]);
};
