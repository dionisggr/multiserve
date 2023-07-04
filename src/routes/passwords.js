const jwt = require('jsonwebtoken');
const Service = require('../services/DB');
const { JWT_ACCESS_SECRET } = require('../config');
const { customError, logger } = require('../utils');
const schemas = require('../schemas');
const db = require('../db');
const routes = {
  login: require('./auth').login,
}

async function reset(req, res, next) {
  try {
    const { app_id } = req.params;
    const { email } = req.body;

    await schemas.users.validateAsync({ email });
    await schemas.apps.validateAsync({ app_id });
  
    const service = new Service(app_id);
    const user = await service.users.get(
      { filters: { email } }
    );

    if (!user) {
      return next(customError('User not found.', 404));
    }

    const code = await service.twoFactorAuth.send(
      { email, app_id, req }
    );

    if (!code) {
      return next(customError('Unable to send 2FA code.', 500));
    }

    logger.info({ email, app_id, code }, '2FA code generated.');

    await service.mfa.create({
      data: { code, email: user.email }
    })

    const token = jwt.sign(
      { email, app_id, code },
      JWT_ACCESS_SECRET,
      { expiresIn: '5m' }
    );

    res.json({ token })
  } catch(error) {
    return next(error);
  }
};

async function mfa(req, res, next) {
  try {
    const { email } = req.auth;
    const { app_id } = req.params;
    const { code } = req.body;

    await schemas.apps.validateAsync({ app_id });

    const exists = await db(`${app_id}__mfa`)
      .where({ email, code })
      .first();
    
    if (!exists) {
      return next(customError('Invalid 2FA code.', 400));
    }

    req.body.email = email;
    req.isMFA = true;

    await routes.login(req, res, next);
  } catch (error) {
    return next(error);
  }
};

module.exports = { reset, mfa };
