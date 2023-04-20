const db = require('../../db');
const userService = require('../services/users');
const { logger } = require('../config');

async function login(req, res, next) {
  const { id, email } = req.user;

  logger.info('User logged in successfully: ', email)

  try {
    await userService.updateUser({ id, data: { last_login: db.fn.now() } });
    
    res.sendStatus(200);
  } catch (error) {
    logger.error('', error);

    return next(error);
  }
}

module.exports = login;
