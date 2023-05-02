const { customError } = require('../utils');
const Service = require('../services');
const { logger } = require('../config');
const schemas = require('../schemas');
const db = require('../db');

async function create(req, res, next) {
  const data = req.body;
  const { app_id } = req.params;

  try {
    await schemas.apps.validateAsync({ app_id })
    await schemas.conversations.existing.validateAsync({
      id: data.conversation_id
    });
    await schemas.messages.new.validateAsync(data);

    const service = new Service(app_id);
    const message = await service.messages.create({ data });
    const user_id = req.user.id;
    const response = {
      ...data,
      message_id: message.id,
      user_id
    };

    logger.info(response, 'Message successfully created.');

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
}

async function get(req, res, next) {
  const { id: message_id, app_id } = req.params;
  const criteria = {};

  try {
    await schemas.apps.validateAsync({ app_id });
    await schemas.messages.existing.validateAsync({ message_id });

    const service = new Service(app_id);
    const result = await service.messages.get({ filters: { id: message_id } });

    if (!result) {
      return next(customError(`Failed to find message(s): ${message_id}`, 404));
    }

    if (!req.user.is_admin) {
      const messages = criteria.multiple ? result : [result];

      if (!messages.some(({ user_id }) => user_id === req.user.id)) {
        return next(
          customError(
            `Unauthorized message (${message_id}) request from ${req.user.id}.`,
            404
          )
        );
      }
    }

    logger.info(result, 'Message(s) found.');

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getAll(req, res, next) {
  const { app_id } = req.params;

  try {
    await schemas.apps.validateAsync({ app_id })

    const service = new Service(app_id);
    const messages = await service.messages.get({ multiple: true });

    if (!messages || !messages.length) {
      return next(customError(`Failed to find messages.`, 404));
    }

    logger.info(messages, 'Messages found.');

    return res.json(messages);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const { id: message_id, app_id } = req.params;
  
  try {
    await schemas.apps.validateAsync({ app_id })
    await schemas.messages.existing.validateAsync({ message_id, ...req.body });

    const service = new Service(app_id);
    const data = { ...req.body, updated_at: db.fn.now() };
    const message = await service.messages.update({
      filters: { id: message_id }, data,
    });

    if (!message) {
      return next(
        customError(`Message does not exist: ${message_id}`, 404)
      );
    }

    logger.info({ ...req.params, ...req.body }, 'Message updated.');

    return res.json(message);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  const { app_id, id: message_id } = req.params;
  
  try {
    await schemas.apps.validateAsync({ app_id })
    await schemas.messages.existing.validateAsync({ message_id });

    const service = new Service(app_id);
    const message = await service.messages.get({
      filters: { id: message_id },
    });

    if (!message) {
      return next(
        customError(`Message does not exist: ${message_id}`, 404)
      );
    }

    await service.messages.remove({ filters: { id: message_id } });

    logger.info(message, 'Message deleted permanently.');

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  get,
  getAll,
  update,
  remove,
};
