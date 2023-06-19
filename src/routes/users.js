const { isBrowserRequest } = require('../utils');
const { customError, logger } = require('../utils');
const Service = require('../services/DB');
const schemas = require('../schemas');
const db = require('../db');

async function create(req, res, next) {
  const { app_id } = req.params;
  const data = req.body;
  const { email } = data;

  try {
    await schemas.signup.validateAsync({ ...data, app_id });

    const service = new Service(app_id);
    const isDuplicate = await service.users.get({ filters: { email } });

    if (isDuplicate) {
      return next(
        customError(`User (${email}) already registered to app: ${app_id}`, 409)
      );
    }

    let user = await service.users.get({ filters: { email } });
    let encrypted;

    if (!user) {
      encrypted = (isBrowserRequest(req))
        ? data.password
        : service.passwords.encrypt(data.password);
      const password = await service.passwords.hash(encrypted);
      
      user = await service.users.create({ data: { ...data, password } });

      logger.info(user, 'User created.');
    }

    delete user.password;

    logger.info({ id: user.id, email, app_id }, 'User successfully registered to app.');

    if (req.path.includes('/signup')) {
      req.body = { email, password: encrypted };
      
      return next();
    }
    
    res.status(201).json(user);
  } catch (error) {
    next(error)
  }
}

async function get(req, res, next) {
  const { user_id, app_id } = req.params;

  try {
    await schemas.users.validateAsync({ user_id });
    await schemas.apps.validateAsync({ app_id });

    const service = new Service(app_id);
    const user = await service.users.get({ filters: { id: user_id } });

    if (!user) {
      return next(customError(`Failed to find user: ${user_id}`, 404));
    }

    if (!req.auth.is_admin && req.auth.user_id !== user_id) {
      return next(
        customError(`Unauthorized user request from ${user_id} for ${user.id}.`, 400)
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
    const { user_id } = req.auth;
    const { app_id } = req.params;
    const { data } = req.body;
    data.updated_at = new Date().toISOString();

    await schemas.users.validateAsync(
      { user_id, ...data }
    );
    await schemas.apps.validateAsync({ app_id });

    console.log(data.password)

    if (data.password) {
      const service = new Service(app_id);
      data.password = await service.passwords.hash(data.password);
    }

    const user = await db(`${app_id}__users`)
      .update(data)
      .where({ id: user_id })
      .returning('*')
    
    console.log({ user })
    
    delete user.password;

    logger.info({ ...req.params, ...data }, 'User updated.');

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { user_id, app_id } = req.params;

    await schemas.users.validateAsync({ user_id });
    await schemas.apps.validateAsync({ app_id });

    const service = new Service(app_id);
    const user = await service.users.get({ filters: { id: user_id } })

    await service.users.remove({ filters: { id: user_id } });
    await service.refreshTokens.remove({ filters: { user_id } });

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
