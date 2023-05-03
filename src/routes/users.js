const { isBrowserRequest } = require('../utils');
const { customError } = require('../utils');
const Service = require('../services/DB');
const { logger } = require('../config');
const schemas = require('../schemas');
const db = require('../db');

async function create(req, res, next) {
  const data = req.body;
  const { email } = data;
  const { app_id } = req.params;

  try {
    await schemas.users.new.validateAsync({ ...data, app_id });

    const service = new Service(app_id);
    const isDuplicate = await service.users.get({ filters: { email } });

    if (isDuplicate) {
      return next(
        customError(`User (${email}) already registered to app: ${app_id}`, 409)
      );
    }

    let user = await service.users.get({ filters: { email } });

    if (!user) {
      const encrypted = (isBrowserRequest(req))
        ? data.password
        : service.passwords.encrypt(data.password);
      const password = await service.passwords.hash(encrypted);
      
      user = await service.users.create({ data: { ...data, password } });

      logger.info(user, 'User created.');
    }

    delete user.password;

    logger.info({ id: user.id, email, app_id }, 'User successfully registered to app.');

    return res.status(201).json(user);
  } catch (error) {
    return next(error)
  }
}

async function get(req, res, next) {
  const { user_id, app_id } = req.params;

  try {
    await schemas.users.existing.validateAsync({ user_id });
    await schemas.apps.validateAsync({ app_id });

    const service = new Service(app_id);
    const user = await service.users.get({ filters: { id: user_id } });

    if (!user) {
      return next(customError(`Failed to find user: ${user_id}`, 404));
    }

    if (!req.user.is_admin && req.user.id !== user_id) {
      return next(
        customError(`Unauthorized user request from ${user_id} for ${user.id}.`, 404)
      );
    }

    delete user.password;

    logger.info(user, 'User found.');
    
    return res.json(user);
  } catch (error) {
    return next(error)
  }
}

async function getAll(req, res, next) {
  const { app_id } = req.params;

  try {
    await schemas.apps.validateAsync({ app_id });

    const service = new Service(app_id);
    let users = await service.users.get({ multiple: true });

    if (!users || !users.length) {
      return next(customError(`Failed to find users.`, 404));
    }

    users = users.map(({ password, ...user }) => user);

    logger.info(users, 'Users found.');

    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const { user_id, app_id } = req.params;

    await schemas.users.existing.validateAsync({ user_id, ...req.body });
    await schemas.apps.validateAsync({ app_id });

    const service = new Service(app_id);
    const data = { ...req.body, updated_at: db.fn.now() };
    const user = await service.users.update({
      filters: { id: user_id },
      data,
    });

    delete user.password;

    logger.info({ ...req.params, ...req.body }, 'User updated.');

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { user_id, app_id } = req.params;

    await schemas.users.existing.validateAsync({ user_id });
    await schemas.apps.validateAsync({ app_id });

    const service = new Service(app_id);
    const user = await service.users.get({ filters: { id: user_id } })

    await service.users.remove({ filters: { id: user_id } });

    logger.info(user, 'User deleted permanently.');

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
