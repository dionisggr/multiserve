const passwords = require('../services/passwords');
const { logger } = require('../config');

const services = {
  encrypt: passwords.encrypt,
  encryption: passwords.encrypt,
  hash: passwords.hash,
  hashing: passwords.hash,
};

async function generate(req, res, next) {
  const { params: { service } } = req;
  const fn = services[service];

  try {
    const response = (isAsync(fn)) ? await fn() : fn();

    logger.info(`Generated ${service} value:`, response);

    
    res.json(response);
  } catch (error) {
    return next(error);
  }
}

async function transform(req, res, next) {
  const { body, params: { service } } = req;
  const fn = services[service];
  const response = {};

  try {
    for (let item in body) {
      const value = body[item];
      response[item] = (isAsync(fn)) ? await fn(value) : fn(value);
    }

    res.json(response);
  } catch (error) {
    return next(error);
  }
}

function isAsync(fn) {
  return fn.constructor.name === 'AsyncFunction';
}

module.exports = { generate, transform };
