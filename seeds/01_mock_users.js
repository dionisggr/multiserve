const uuid = require('uuid');
const { ADMIN_PASSWORD } = require('../src/config');
const Service = require('../src/services');

const table = 'promptwiz__users';

exports.seed = async function (db) {
  const service = new Service();
  const encryptedAdminPassword = service.passwords.encrypt(ADMIN_PASSWORD);
  const admin_password = await service.passwords.hash(encryptedAdminPassword);

  await db(table).del();
  await db(table).insert([
    {
      id: uuid.v4(),
      username: "tec3",
      email: "tec3org@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: uuid.v4(),
      username: "dio",
      email: "dionisggr@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: uuid.v4(),
      username: "doug",
      email: "briancarter340@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: uuid.v4(),
      username: "lili",
      email: "lile7886@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: "a83ef916-21d5-468f-a8c3-35a59b947b32",
      username: "random_guy",
      email: "random@guy.com",
      password: "password",
      is_admin: false,
    },
  ]);
};
