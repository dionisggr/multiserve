const uuid = require('uuid');
const { logger } = require('../config');
const { customError, isBrowserRequest } = require('../utils');
const service = { email: require('./email') };

async function send({ email, app_id, req }) {
  const code = uuid.v4().substring(0, 6);
  const app = app_id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  const data = { app, email, code };
  const expires_at = Date.now() + 1000 * 60 * 5  // +5 minutes

  if (isBrowserRequest(req)) {
    const result = await service.email.send(data);
    const log = { ...data, status: result.statusCode };

    logger.info(log, 'Message sent: %s')
  }
  
  Object.assign(req.session, { email, app_id, code, expires_at });

  return code;
};

function validate(req) {
  const { session, body: input } = req;
  const { expires_at, ...twoFactorAuth } = session;

  if (Date.now() > expires_at) {
    logger.error({ twoFactorAuth, input }, 'Token expired');

    throw customError('Token expired', 401);
  }

  for (field in input) {
    if (input[field] !== twoFactorAuth[field]) {
      logger.error({ twoFactorAuth, input }, 'Invalid token');

      throw customError('Invalid token', 401);
    }
  }
};

module.exports = { send, validate };
