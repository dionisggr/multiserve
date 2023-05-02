const Joi = require('joi');

const schemas = {
  users: {
    new: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(64).required(),
      app_id: Joi.string().required(),
    }),
    existing: Joi.object({
      id: Joi.alternatives().try(
        Joi.string().guid({ version: 'uuidv4' }),
        Joi.string()
      ),
      user_id: Joi.alternatives().try(
        Joi.string().guid({ version: 'uuidv4' }),
        Joi.string()
      ),
      username: Joi.string().allow(null),
      email: Joi.string().email(),
      password: Joi.string().min(8).max(64),
      is_admin: Joi.boolean(),
      created_at: Joi.date().iso(),
      updated_at: Joi.date().iso(),
      last_login: Joi.date().iso(),
      avatar: Joi.string()
        .allow(null)
        .uri({ scheme: ['http', 'https'] }),
    }).xor('id', 'user_id', 'email'),
  },
  apps: Joi.object({
    id: Joi.string(),
    app_id: Joi.string(),
    name: Joi.string(),
    is_archived: Joi.boolean(),
    created_at: Joi.date().iso(),
    updated_at: Joi.date().iso(),
  }).xor('id', 'app_id'),
  conversations: {
    new: Joi.object({
      title: Joi.string().required(),
      created_by: Joi.string().required(),
    }),
    existing: Joi.object({
      id: Joi.string().guid({ version: 'uuidv4' }),
      conversation_id: Joi.string().guid({ version: 'uuidv4' }),
      title: Joi.string(),
      created_by: Joi.string(),
      type: Joi.string().valid('single', 'group'),
      updated_at: Joi.date().iso(),
      archived_at: Joi.date().iso(),
    }).xor('id', 'conversation_id'),
  },
  messages: {
    new: Joi.object({
      conversation_id: Joi.string().guid({ version: 'uuidv4' }).required(),
      updated_from: Joi.string().guid({ version: 'uuidv4' }),
      content: Joi.string().required(),
      user_id: Joi.string().required(),
    }),
    existing: Joi.object({
      id: Joi.string().guid({ version: 'uuidv4' }),
      message_id: Joi.string().guid({ version: 'uuidv4' }),
      conversation_id: Joi.string().guid({ version: 'uuidv4' }),
      updated_from: Joi.string().guid({ version: 'uuidv4' }),
      content: Joi.string(),
      user_id: Joi.string(),
    }).xor('id', 'message_id'),
  },
};

module.exports = schemas;
