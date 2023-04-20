const db = require('../../db');
const userService = require('../services/users');
const { logger } = require('../config');

async function login(req, res, next) {
  const { id, email } = req.user;

  logger.info({ message: 'User logged in successfully: ', id, email });

  try {
    await userService.updateUser({ id, data: { last_login: db.fn.now() } });
    
    res.sendStatus(200);
  } catch (error) {
    logger.error('', error);

    return next(error);
  }
}

async function logout(req, res, next) {
  const { id, email } = req.user;
  
  try {
    req.logout();

    await req.session.destroy();

    res.clearCookie('connect.sid');

    logger.info({ message: 'User logged out successfully', id, email });

    res.sendStatus(200);
  } catch (error) {
    logger.error('Failed to destroy session:', { error });
    
    return next(error);
  }
}

module.exports = { login, logout };
