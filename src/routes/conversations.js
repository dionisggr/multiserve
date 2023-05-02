const { customError } = require('../utils');
const Service = require('../services');
const { logger } = require('../config');
const schemas = require('../schemas');
const db = require('../db');

async function create(req, res, next) {
  const { app_id } = req.params;
  const data = req.body;

  try {
    await schemas.conversations.new.validateAsync(data);

    const service = new Service(app_id);
    const conversation = await service.conversations.create({ data });
    const user_id = req.isAuthenticated() && req.user.id;
    const response = {
      conversation_id: conversation.id,
      user_id
    };

    logger.info(response, 'Conversation successfully created.');

    return res.status(201).json(response);
  } catch (error) {
    return next(error)
  }
}

async function get(req, res, next) {
  const { app_id, id: conversation_id } = req.params;

  try {
    await schemas.conversations.existing.validateAsync({ conversation_id });

    const service = new Service(app_id);
    const conversation = await service.conversations.get({ filters: { id: conversation_id } });

    if (!conversation) {
      return next(customError(`Failed to find conversation: ${conversation_id}`, 404));
    }

    if (!req.user.is_admin && req.user.id !== conversation.created_by) {
      return next(
        customError(`Unauthorized conversation (${conversation_id}) request from ${req.user.id}.`, 404)
      );
    }

    logger.info(conversation, 'Conversation found.');
    
    return res.json(conversation);
  } catch (error) {
    return next(error)
  }
}

async function getAll(req, res, next) {
  const { app_id } = req.params;

  try {

    const service = new Service(app_id);
    const conversations = await service.conversations.get({ multiple: true });

    if (!conversations || !conversations.length) {
      return next(customError(`Failed to find users.`, 404));
    }

    if (!req.user.is_admin) {
      if (!conversations.some(({ created_by }) => created_by === req.user.id)) {
        return next(
          customError(
            `Unauthorized message (${message_id}) request from ${req.user.id}.`,
            404
          )
        );
      }
    }

    logger.info(conversations, 'Conversations found.');

    return res.json(conversations);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const { app_id, id: conversation_id } = req.params;

    await schemas.conversations.existing.validateAsync({ conversation_id, ...req.body });

    const service = new Service(app_id);
    const data = { ...req.body, updated_at: db.fn.now() };
    const conversation = await service.conversations.update({
      filters: { id: conversation_id }, data,
    });

    logger.info({ ...req.params, ...req.body }, 'Conversation updated.');

    return res.json(conversation);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { app_id, id: conversation_id } = req.params;

    await schemas.conversations.existing.validateAsync({ conversation_id });

    const service = new Service(app_id);
    const conversation = await service.conversations.get({
      filters: { id: conversation_id }
    });

    if (!conversation) {
      return next(customError(`Conversation does not exist: ${conversation_id}`, 404));
    }

    await service.conversations.remove({ filters: { id: conversation_id } });

    logger.info(conversation, 'Conversation deleted permanently.');

    return res.sendStatus(204);
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  create,
  get,
  getAll,
  update,
  remove,
}
