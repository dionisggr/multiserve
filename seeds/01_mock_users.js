const { ADMIN_PASSWORD } = require('../src/config');
const passwords = require('../src/services/passwords');

exports.seed = async function (db) {
  const encryptedAdminPassword = passwords.encrypt(ADMIN_PASSWORD);
  const admin_password = await passwords.hash(encryptedAdminPassword);

  await db("users").del();
  await db("users").insert([
    {
      id: 'fc0e8a81-8252-42fd-854f-6192c6eed939',
      username: "tec3",
      email: "tec3org@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: '68ae0a4c-c575-4a44-b9b9-48b49919a3c6',
      username: "dio",
      email: "dionisggr@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: '0babe65a-d467-4f99-8a04-120e74bc60de',
      username: "doug",
      email: "briancarter340@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: 'a178dda2-5378-4901-aacf-a9137b783ebe',
      username: "lili",
      email: "lile7886@gmail.com",
      password: admin_password,
      is_admin: true,
    },
  ]);
};
