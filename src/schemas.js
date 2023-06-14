const Joi = require('joi');

// Common
const uuid = Joi.string().guid({ version: 'uuidv4' });
const id = Joi.alternatives().try(uuid, Joi.string());
const email = Joi.string().email();
const username = Joi.string();
const password = Joi.string().min(8).max(64);
const app_id = Joi.string().required();
const is_archived = Joi.boolean();
const created_at = Joi.date().iso();
const updated_at = Joi.date().iso();
const lastLogin = Joi.date().iso();
const is_admin = Joi.boolean();

const schemas = {
  login: Joi.object({ 
    email,
    username,
    password: password.required(),
    app_id: app_id.required(),
  }).xor('username', 'email'),
  signup: Joi.object({
    username: username,
    email: email.required(),
    password: password.required(),
    app_id: app_id.required(),
    first_name: Joi.string().min(2).max(64),
    last_name: Joi.string().min(2).max(64),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    is_admin,
  }),
  apps: Joi.object({
    name: Joi.string(),
    id,
    app_id,
    is_archived,
    created_at,
    updated_at,
  }).xor('id', 'app_id'),
  users: Joi.object({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    user_id: id,
    id,
    username,
    email,
    password,
    is_admin,
    created_at,
    updated_at,
    lastLogin,
  }).xor('id', 'user_id', 'email'),
  conversations: {
    new: Joi.object({
      title: Joi.string(),
      type: Joi.string().valid('single', 'group'),
      app_id: app_id.required(),
      created_by: id,
    }),
    existing: Joi.object({
      title: Joi.string(),
      archived_at: Joi.date().iso(),
      app_id: app_id.required(),
      conversation_id: id,
      created_by: id,
      id,
      updated_at,
    }).xor('id', 'conversation_id'),
  },
  messages: {
    new: Joi.object({
      content: Joi.string().required(),
      conversation_id: id.required(),
      user_id: id.required(),
      app_id: app_id.required(),
    }),
    existing: Joi.object({
      content: Joi.string(),
      archived_at: Joi.date().iso(),
      app_id: app_id.required(),
      conversation_id: id,
      user_id: id,
      message_id: id,
      id,
      updated_at,
    }).xor('id', 'message_id'),
  }
};

module.exports = schemas;
