const service = require('../services/users');
const userApps = require('../services/user_apps');
const passwords = require('../services/passwords');
const schemas = require('../services/schemas');
const { logger } = require('../config');

async function createProfile(req, res, next) {
  try {
    const data = req.body;
    const { email, app_id, password: encryptedPassword } = data;

    await schemas.apps.validateAsync({ id: app_id });
    await schemas.users.new.validateAsync(data);

    const user = await service.getUser({ filters: { email } });

    if (user) {
      logger.info('User already exists, registering to app instead.', { user, app_id });

      return await userApps.registerUser({ user_id: user.id, app_id });
    }
    
    const hashedPassword = await passwords.hash(encryptedPassword);
    const newUser = await service.createUser({ ...data, hashedPassword });

    logger.info('User created:', newUser);

    res.redirect(307, '/login', { body: data });
  } catch (error) {
    return next(error)
  }
}

async function getProfile(req, res, next) {
  try {
    const id = req.params.id;

    await schemas.users.existing.validateAsync({ id });

    const user = await service.getUser({ id });

    if (!user) {
      const error = createCustomError(`Failed to find user: ${id}`, 404);

      return next(error);
    }

    logger.info('User found:', { email: user.email });

    res.json(user);
  } catch (error) {
    return next(error)
  }
}

async function getAllProfiles(req, res, next) {
  try {
    const users = await service.getUser({ multiple: true })

    if (!users) {
      const error = createCustomError('Failed to find users', 404);

      return next(error);
    }

    logger.info('Users found', users.map(({ email }) => email));

    res.json(users);
  } catch (error) {
    return next(error)
  }
}

async function updateProfile(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    await schemas.users.existing.validateAsync(data);

    const user = await service.getUser({ id })

    if (!user) {
      const error = createCustomError(`User does not exist: ${id}`, 404);

      return next(error);
    }

    const updatedUser = await service.updateUser({ id, data })

    delete updatedUser.password

    res.json(updatedUser);
  } catch (error) {
    return next(error)
  }
}

async function deleteProfile(req, res, next) {
  try {
    const { id: user_id } = req.params;
    const { app_id, delete: shouldDelete } = req.body;

    await schemas.apps.validateAsync({ id: app_id });
    await schemas.users.existing.validateAsync({ id });
    
    const user = await service.getUser({ id: user_id })

    if (!user) {
      const error = createCustomError(`User does not exist: ${user_id}`, 404);

      return next(error);
    }

    if (shouldDelete) {
      await service.deleteUser(id);

      logger.info('User deleted', user);
    } else {
      await userApps.unregisterUser({ user_id, app_id });

      logger.info(`User ${user_id} unregistered from app: ${app_id}`, user);
    }

    res.sendStatus(204);
  } catch (error) {
    return next(error)
  }
}



function createCustomError(message, status) {
  const error = new Error(message);
  error.status = status;

  return error;
}

module.exports = {
  createProfile,
  getProfile,
  getAllProfiles,
  updateProfile,
  deleteProfile,
}
