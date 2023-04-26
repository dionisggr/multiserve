const Service = require('../services');
const { customError } = require('../utils');
const { logger } = require('../config');
const schemas = require('../schemas');

async function reset(req, res, next) {
  try {
    const { id: app_id } = req.params;
    const { email } = req.body;

    await schemas.users.existing.validateAsync({ email });
    await schemas.apps.validateAsync({ app_id });
  
    const service = new Service(app_id);
    const user = await service.users.get({ filters: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const code = await service.twoFactorAuth.send({ email, app_id, req });

    if (code) logger.info({ code }, '2FA code generated.')

    return res.sendStatus(200);
  } catch(error) {
    return next(error);
  }
};

async function verify(req, res, next) {
  try {
    const { id: app_id } = req.params;
    const { email } = req.body;
    req.body.app_id = app_id;

    await schemas.users.existing.validateAsync({ email });
    await schemas.apps.validateAsync({ app_id });

    const service = new Service(app_id);
    const user = await service.users.get({ filters: { email } });
    
    if (!user) {
      return next(customError('User not found.', 404));
    }
    
    service.twoFactorAuth.validate(req);

    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
};

module.exports = { reset, verify };
