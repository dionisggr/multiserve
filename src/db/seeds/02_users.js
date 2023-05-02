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
        id: '2207d7b2-1559-43a4-8236-470dff0e0356',
        username: 'tec3',
        email: ADMIN_EMAIL,
        password: admin_password,
        is_admin: true,
      },
      {
        id: '07ffe874-21f0-4805-ad39-7ed440835a8d',
        username: 'dio',
        email: 'dionisggr@gmail.com',
        password: admin_password,
        is_admin: true,
      },
      {
        id: '4c3e475d-1d8e-4c22-8531-042b5e1da77b',
        username: 'lili',
        email: 'lile7886@gmail.com',
        password: admin_password,
        is_admin: true,
      },
      {
        id: 'a698f684-c659-46a1-b77e-c30c33e9c117',
        username: 'doug',
        email: 'briancarter340@gmail.com',
        password: admin_password,
        is_admin: true,
      },
      {
        id: 'gpt',
        username: 'gpt',
        email: 'gpt@tec3org.com',
        password: admin_password,
        is_admin: false,
      },
      {
        id: 'demo',
        username: 'demo',
        email: 'demo@tec3org.com',
        password: demo_password,
        is_admin: false,
      },
    ]);
  }
};
