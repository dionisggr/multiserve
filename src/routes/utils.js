const uuid = require('uuid');
const { logger } = require('../utils');
const Service = {
  DB: require('../services/DB'),
  AI: require('../services/AI'),
};

const { passwords } = new Service.DB();
const AI = new Service.AI();
const services = {
  encryption: passwords.encrypt,
  hash: passwords.hash,
  uuid: uuid.v4,
};

async function generate(req, res, next) {
  const { params: { service } } = req;
  const fn = services[service];

  try {
    const response = (isAsync(fn)) ? await fn() : fn();

    logger.info({ message: `Generated value for ${service}:`, response });
    
    return res.json(response);
  } catch (error) {
    return next(error);
  }
}

async function transform(req, res, next) {
  const { body, params: { service, value } } = req;
  const fn = services[service];
  let response = {};

  try {
    if (value) {
      response = (isAsync(fn)) ? await fn(value) : fn(value);
    } else {
      for (let item in body) {
        const input = body[item];
        response[item] = (isAsync(fn)) ? await fn(input) : fn(input);
      }
    }

    return res.json(response);
  } catch (error) {
    return next(error);
  }
}

function isAsync(fn) {
  return fn.constructor.name === 'AsyncFunction';
}

module.exports = { generate, transform };
