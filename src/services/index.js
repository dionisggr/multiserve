const Users = require('./users');
const passwords = require('./passwords');

class Service {
  constructor() {
    this.passwords = passwords;
  }

  async use(app_id) {
    this.users = new Users(app_id);

    return this;
  }
};

module.exports = Service;
