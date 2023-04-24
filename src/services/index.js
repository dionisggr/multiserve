const Users = require('./users');
const passwords = require('./passwords');
const twoFactorAuth = require('./2FA');

class Service {
  constructor() {
    this.passwords = passwords;
    this.twoFactorAuth = twoFactorAuth;
  }

  async use(app_id) {
    this.users = new Users(app_id);

    return this;
  }
};

module.exports = Service;
