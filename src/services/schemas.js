const Joi = require('joi');

const schemas = {
  users: {
    new: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(64).required(),
    }),
    existing: Joi.object({
      id: Joi.string().guid({ version: 'uuidv4' }),
      username: Joi.string().allow(null),
      email: Joi.string().email(),
      password: Joi.string().min(8).max(64),
      is_admin: Joi.boolean(),
      created_at: Joi.date().iso(),
      updated_at: Joi.date().iso(),
      last_login: Joi.date().iso(),
      avatar: Joi.string().allow(null).uri({ scheme: ['http', 'https'] }),
    }),
  },
  apps: Joi.object({
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
    name: Joi.string(),
    is_archived: Joi.boolean(),
    created_at: Joi.date().iso(),
    updated_at: Joi.date().iso(),
  }),
};

module.exports = schemas;
