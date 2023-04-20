require('dotenv').config();

const knex = require("knex");
const config = require("./knexfile");

const db = knex(config);

module.exports = db;
