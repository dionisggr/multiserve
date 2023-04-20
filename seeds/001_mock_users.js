const { API_KEY, ADMIN_PASSWORD } = require('../src/config');
const passwords = require('../src/services/passwords');

exports.seed = async function (knex) {
  const encryptedAdminPassword = passwords.encrypt(ADMIN_PASSWORD);
  const admin_password = await passwords.hash(encryptedAdminPassword);

  await knex("users").del();
  await knex("users").insert([
    {
      id: 'e66a39d0-2b78-42f2-aecb-ee4ec5bbdcdd',
      username: "tec3",
      email: "tec3org@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: '4f39884f-2aa8-45cc-9f39-054b28bd02e9',
      username: "dio",
      email: "dionisggr@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: '06278bf3-7476-4c95-84da-57b4f448bb67',
      username: "doug",
      email: "briancarter340@gmail.com",
      password: admin_password,
      is_admin: true,
    },
    {
      id: '001ef402-f0ba-46c2-93ef-32886a5a86f3',
      username: "lili",
      email: "lile7886@gmail.com",
      password: admin_password,
      is_admin: true,
    },
  ]);
};
