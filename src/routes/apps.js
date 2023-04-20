const service = require('../services/apps');
const { logger } = require('../config');

async function get(req, res, next) {
  const app_id = req.params.id || req.body.app_id;
  
  const criteria = (app_id === 'all')
    ? { multiple: true }
    : { id: app_id };
  
  console.log(app_id, criteria)

  try {
    let result = await service.find(criteria);

    if (app_id !== 'all') result = [result];

    logger.info({ message: 'Apps found:', apps: result.map(({ id, name }) => ({ id, name })) });

    res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { get };
