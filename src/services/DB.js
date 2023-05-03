const CRUD = require('./CRUD');
const passwords = require('./passwords');
const twoFactorAuth = require('./two-factor-auth');
const email = require('./email');

class DB extends CRUD {
  constructor(app_id, table) {
    super(app_id);

    this.app_id = app_id;
    this.table = `${app_id}__${table}`;
    this.passwords = passwords;
    this.twoFactorAuth = twoFactorAuth;
    this.email = email;
  }

  get apps() {
    this.table = 'apps';

    return this;
  }

  get users() {
    this.table = `${this.app_id}__users AS ${this.app_id[0] + 'u'}`
    
    return this;
  }

  get conversations() {
    this.table = `${this.app_id}__conversations AS ${this.app_id[0] + 'c'}`;

    return this;
  }

  get messages() {
    this.table = `${this.app_id}__messages AS ${this.app_id[0] + 'm'}`

    return this;
  }
};

module.exports = DB;
