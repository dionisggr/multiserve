const { NODE_ENV, API_KEY } = require('../config');
const { customError } = require('../utils');
const schemas = require('../schemas');
const Service = require('../services');

const errors = {
  authentication: {
    development: 'Missing or incorrect credentials, or expired session.',
    production: 'Authentication failed.',
  },
  authorization: {
    development: 'Missing or invalid API Key.',
    production: 'Unauthorized access.',
  }
};

const session = {
  minutesLeft: async ({ cookie }) => {
    const currentTime = new Date().getTime();
    const expirationTime = cookie._expires && new Date(cookie._expires).getTime();
    const diff = (currentTime - expirationTime) / (1000 * 60);

    return diff;
  }
}

function authorization(req, res, next) {
  console.log(req.path)
  const auth = req.get('Authorization');

  if (!auth || !auth.includes(API_KEY)) {
    return next(customError(errors.authorization[NODE_ENV], 401));
  }

  next();
};

async function authentication(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(customError(errors.authentication[NODE_ENV], 401));
  }

  if (session.minutesLeft(req.session) < 30) {
    await req.session.regenerate();
  }

  next();
};

function admin(req, res, next) {
  const { user: authenticated } = req;

  if (!authenticated.is_admin) {
    return next(customError(errors.authentication[NODE_ENV], 401));
  }

  next();
};

module.exports = {
  session,
  admin,
  authorization,
  authentication,
};
