const { logger } = require('../utils');

function errorHandler(error, req, res, next) {
  const message = error.message || 'Internal Server Error';
  const response = { message, error };
  const status = error.status || error.statusCode || 500;
  
  logger.error(response);

  return res.status(status).send(response);
};

module.exports = errorHandler;
