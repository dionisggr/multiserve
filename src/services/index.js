const CRUD = require('./CRUD');
const passwords = require('./passwords');
const twoFactorAuth = require('./two-factor-auth');

class Service extends CRUD {
  constructor(app_id) {
    super(app_id);

    this.app_id = app_id;
    this.passwords = passwords;
    this.twoFactorAuth = twoFactorAuth;

  }

  get apps() {
    this.table = 'apps';

    return this;
  }

  get users() {
    this.table = `${this.app_id}__users`
    
    return this;
  }
};

module.exports = Service;
