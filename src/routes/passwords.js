const Service = require('../services');

async function reset(req, res, next) {
  try {
    const { id: app_id } = req.params;
    const { email } = req.body;

    await schemas.users.existing.validateAsync({ email });
    await schemas.apps.validateAsync({ app_id });
  
    const service = await new Service().use(app_id);
    const user = await service.users.get({ filters: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    service.twoFactorAuth.send({ email, app_id, req })

    return res.sendStatus(200);
  } catch(error) {
    return next(error);
  }
};

async function verify(req, res, next) {
  try {
    const { id: app_id } = req.params;
    const { email } = req.body;

    await schemas.users.existing.validateAsync({ email });
    await schemas.apps.validateAsync({ app_id });

    const service = await new Service().use(app_id);
    const user = await service.users.get({ filters: { email } });
    
    if (!user) {
      return next(customError('User not found.', 404));
    }

    const verified = service.twoFactorAuth.validate(req);

    if (!verified) {
      return next(customError('Invalid token.', 401));
    }

    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
};

module.exports = { reset, verify };
