const { isBrowserRequest } = require('../utils');
const { customError, logger } = require('../utils');
const Service = require('../services/DB');
const schemas = require('../schemas');
const auth = require('./auth');
const db = require('../db');

async function create(req, res, next) {
  const { app_id } = req.params;
  const {
    organization_id = req.body.organizationId,
    ...data
  } = req.body;
  const { email } = data;

  for (const key in data) {
    if (!data[key]) {
      delete data[key];
    }
  }

  try {
    await schemas.signup.validateAsync({ ...data, app_id });

    const service = new Service(app_id);
    let user = await service.users.get({ filters: { email } });

    if (user) {
      return next(
        customError(`User (${email}) already registered to app: ${app_id}`, 409)
      );
    }

    const encrypted = (isBrowserRequest(req))
      ? data.password
      : service.passwords.encrypt(data.password);
    const password = await service.passwords.hash(encrypted);

    user = await service.users.create({ data: { ...data, password } });
    delete user.password;

    const newData = [];

    if (organization_id) {
      newData.push({ user_id: user.id, organization_id })
    }

    await db(`${app_id}__user_organizations`).insert(newData);

    logger.info(user, 'User created.');
    logger.info({ id: user.id, email, app_id },
      'User successfully registered to app.'
    );
    
    if (organization_id) {
      logger.info({ user_id: user.id, organization_id },
        'User successfully registered to organization.'
      )
    }

    if (req.path.includes('/signup')) {
      req.body = {
        email,
        password: encrypted,
        organization_id,
      };
      
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

    if (user) {
      delete user.password;

      logger.info(user, 'User found.');
    }
    
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
    const { id: user_id, email } = req.auth;
    const { app_id } = req.params;
    const { data } = req.body;
    
    data.updated_at = new Date().toISOString();

    await schemas.apps.validateAsync({ app_id });
    await schemas.users.validateAsync({ user_id, ...data });

    if (data.password) {
      const service = new Service(app_id);
      data.password = await service.passwords.hash(data.password);
    }

    const updated = await db(`${app_id}__users`)
      .update(data)
      .where({ id: user_id })
      .returning('*')
    
    delete updated.password;

    logger.info({ user_id, ...data, app_id }, 'User updated.');

    if (data.password) {
      req.body = { email, password: req.body.data.password };

      return await auth.login(req, res, next);
    } else {
      return res.json(updated[0]);
    }
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
