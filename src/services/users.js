const db = require('../../db');
const CRUD = require('./CRUD');

class Users {
  constructor(app_id) {
    this.table = `${app_id}__users`;
  }
  
  async create(criteria) {
    return await CRUD.create(this.table, criteria);
  }
  
  async get(criteria) { 
    return await CRUD.read(this.table, criteria);
  }
  
  async update(criteria) {
    criteria.data = { updated_at: db.fn.now() };
  
    return await CRUD.update(this.table, criteria);
  }
  
  async remove(criteria) {
    return await CRUD._delete(this.table, criteria);
  }
}

module.exports = Users;
