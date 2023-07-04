const Joi = require('joi');

// Common
const uuid = Joi.string().guid({ version: 'uuidv4' });
const id = Joi.alternatives().try(uuid, Joi.string());
const email = Joi.string().email();
const username = Joi.string();
const name = Joi.string().min(2).max(64);
const password = Joi.string().min(8).max(64);
const app_id = Joi.string();
const is_archived = Joi.boolean();
const created_at = Joi.date().iso();
const updated_at = Joi.date().iso();
const lastLogin = Joi.date().iso();
const is_admin = Joi.boolean();
const avatar = Joi.string().pattern(/^data:(.*?);base64,(.*)$/);  // base64 encoded image

const schemas = {
  login: Joi.object({ 
    email,
    username,
    password: password.required(),
    app_id: app_id.required(),
  }).xor('username', 'email'),
  signup: Joi.object({
    password: password.required(),
    app_id: app_id.required(),
    organization_id: Joi.string(),
    id: id,
    email: email,
    username: username,
    first_name: name,
    last_name: name,
    avatar,
    is_admin,
  }).xor('id', 'email'),
  google: Joi.object({
    credential: Joi.string().required(),
    app_id: app_id.required(),
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
    openai_api_key: Joi.string(),
    user_id: id,
    first_name: name,
    last_name: name,
    id,
    username,
    email,
    password,
    avatar,
    is_admin,
    created_at,
    updated_at,
    lastLogin,
  }).xor('id', 'user_id', 'email'),
  conversations: {
    new: Joi.object({
      title: Joi.string(),
      type: Joi.string(),
      organization_id: id,
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
      user_id: id.required(),
      app_id: app_id.required(),
      conversation_id: id,
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
