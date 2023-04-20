const service = require('../services/apps');
const { logger } = require('../config');

async function get(req, res, next) {
  const app_id = req.params.id || req.body.app_id;
  
  const criteria = (app_id === 'all')
    ? { multiple: true }
    : { id: app_id };

  try {
    const apps = await service.find(criteria);

    console.log(criteria);

    logger.info('Apps found:', apps.map(({ id }) => id));

    res.json(apps);
  } catch (error) {
    return next(error);
  }
}

module.exports = { get };
