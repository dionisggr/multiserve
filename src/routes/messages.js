const { customError } = require('../utils');
const Service = require('../services/DB');
const { logger } = require('../utils');
const schemas = require('../schemas');
const db = require('../db');

async function create(req, res, next) {
  const { user_id } = req.auth;
  const { conversation_id, app_id } = req.params;
  const data = { ...req.body, conversation_id, user_id };

  try {
    await schemas.conversations.existing.validateAsync(
      { conversation_id, app_id }
    );
    await schemas.messages.new.validateAsync(
      { ...data, app_id }
    );

    const service = new Service(app_id);
    const message = await service.messages.create({ data });

    logger.info(message, 'Message successfully created.');

    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
}

async function get(req, res, next) {
  const { user_id, organization_id } = req.auth;
  const { message_id, conversation_id, app_id } = req.params;

  try {
    await schemas.messages.existing.validateAsync(
      { message_id, conversation_id, app_id }
    );

    const filters = { id: message_id, conversation_id };

    if (organization_id) {
      filters.organization_id = organization_id;
    } else {
      filters.user_id = user_id;
    }

    const service = new Service(app_id);
    const message = await service.messages.get({ filters });

    if (!message) {
      return next(
        customError(`Failed to find message(s): ${message_id}`, 404)
      );
    }

    logger.info(message, 'Message found.');

    return res.json(message);
  } catch (error) {
    return next(error);
  }
}

async function getAll(req, res, next) {
  const { user_id, organization_id } = req.auth;
  const { conversation_id, app_id } = req.params;

  try {
    await schemas.conversations.existing.validateAsync(
      { conversation_id, app_id }
    );
    
    const filters = { conversation_id };

    if (organization_id) {
      filters.organization_id = organization_id;
    } else {
      filters.user_id = user_id;
    }

    const service = new Service(app_id);
    const messages = await db(service.messages.table).where(filters)

    console.log(messages);

    if (messages.length) {
      logger.info(messages.map(({ id }) => id), 'Messages found.');
    } else {
      logger.info('No messages found.');
    }

    return res.json(messages);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const { user_id } = req.auth;
  const { message_id, conversation_id, app_id } = req.params;
  
  try {
    const data = { ...req.body, updated_at: new Date().toISOString() };

    await schemas.messages.existing.validateAsync(
      { message_id, conversation_id, app_id, ...data }
    );

    const service = new Service(app_id);
    const message = await service.messages.update({
      data,
      filters: { id: message_id, conversation_id, user_id },
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
  const { user_id } = req.auth;
  const { message_id, conversation_id, app_id } = req.params;
  
  try {
    const filters = { id: message_id, conversation_id, user_id };

    await schemas.messages.existing.validateAsync(
      { ...filters, conversation_id, app_id }
    );

    const service = new Service(app_id);
    const message = await service.messages.get({ filters });

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
