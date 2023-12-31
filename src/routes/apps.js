const { customError } = require('../utils');
const Service = require('../services/DB');
const schemas = require('../schemas');
const { logger } = require('../utils');

async function get(req, res, next) {
  const { id } = req.params;
  
  try {
    await schemas.apps.validateAsync({ id });

    const service = new Service(id);
    const app = await service.apps.get({ filters: { id } });
    
    if (!app) {
      return next(customError(`Failed to find app.`, 404));
    }

    logger.info(app, 'App found.');
    
    return res.json(app);
  } catch (error) {
    return next(error)
  }
}

async function getAll(req, res, next) {
  try {
    const service = new Service('apps');
    const apps = await service.apps.get({ multiple: true });

    if (!apps || !apps.length) {
      return next(customError(`Failed to find apps.`, 404));
    }

    logger.info(apps, 'Apps found.');

    return res.json(apps);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get,
  getAll,
};
