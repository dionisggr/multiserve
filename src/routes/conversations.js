const { customError } = require('../utils');
const Service = require('../services/DB');
const { logger } = require('../utils');
const schemas = require('../schemas');
const db = require('../db');

async function create(req, res, next) {
  const { user_id } = req.auth;
  const { app_id } = req.params;
  const data = req.body;

  try {
    await schemas.conversations.new.validateAsync(
      { ...data, app_id }
    );

    data.created_by = user_id;

    const service = new Service(app_id);
    const conversation = await service.conversations.create({ data });
    const response = { conversation };

    logger.info(response, 'Conversation successfully created.');

    return res.status(201).json(response);
  } catch (error) {
    return next(error)
  }
}

async function get(req, res, next) {
  const { organization_id, user_id } = req.auth;
  const { conversation_id, app_id } = req.params;

  try {
    await schemas.conversations.existing.validateAsync(
      { conversation_id, app_id }
    );

    const conversation = await db(`${app_id}__conversations`)
      .where({ id: conversation_id, created_by: user_id })
      .orWhere({ id: conversation_id, organization_id })
      .first();

    if (!conversation) {
      return next(
        customError(`Failed to find conversation: ${conversation_id}`, 404)
      );
    }

    logger.info(conversation, 'Conversation found.');
    
    return res.json(conversation);
  } catch (error) {
    return next(error)
  }
}

async function getAll(req, res, next) {
  const { organization_id, user_id } = req.auth;
  const { app_id } = req.params;

  try {
    await schemas.apps.validateAsync({ app_id });
    
    const filters = (organization_id) 
      ? { organization_id }
      : { created_by: user_id };
    const conversations = await db(`${app_id}__conversations`)
      .where(filters)
    
    if (conversations.length) {
      logger.info(conversations.map(({ id }) => id),
        'Conversations found.'
      );
    } else {
      logger.info('No conversations found.');
    }

    return res.json(conversations);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const { user_id } = req.auth;
  const { conversation_id, app_id } = req.params;

  try {
    await schemas.conversations.existing.validateAsync(
      { conversation_id, app_id, ...req.body }
    );

    const service = new Service(app_id);

    const conversation = await service.conversations.update({
      filters: { id: conversation_id, created_by: user_id },
      data: { ...req.body, updated_at: db.fn.now() },
    });

    if (!conversation) {
      return next(
        customError(`Could not update conversation: ${conversation_id}`, 404)
      );
    }

    logger.info({ ...req.params, ...req.body }, 'Conversation updated.');

    return res.json(conversation);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  const { user_id } = req.auth;
  const { conversation_id, app_id } = req.params;
  
  try {
    await schemas.conversations.existing.validateAsync(
      { conversation_id, app_id }
    );

    const service = new Service(app_id);
    const conversation = await service.conversations.get({
      filters: { id: conversation_id, created_by: user_id }
    });

    if (!conversation) {
      return next(
        customError(`Conversation does not exist: ${conversation_id}`, 404)
      );
    }

    await service.conversations.remove({
      filters: {
        id: conversation_id,
        created_by: user_id
      }
    });

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
