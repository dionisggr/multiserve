const { NODE_ENV, API_KEY } = require('../config');

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

function authorization(req, res, next) {
  const auth = req.get('Authorization');

  if (!auth || !auth.includes(API_KEY)) {
    const error = new Error(errors.authorization[NODE_ENV]);
    error.status = 401;

    return next(error);
  }

  next();
};

async function authentication(req, res, next) {
  const error = new Error(errors.authentication[NODE_ENV]);
  error.status = 401;

  if (!req.isAuthenticated()) {
    return next(error);
  }
  if (session.minutesLeft(req.session) < 30) await req.session.regenerate();

  next();
};

function admin(req, res, next) {
  const { user: authenticated } = req;

  if (!authenticated.is_admin) {
    const error = new Error(errors.authentication[NODE_ENV]);
    error.status = 401;
    
    return next(error);
  }

  next();
};

const session = {
  minutesLeft: async ({ cookie }) => {
    const currentTime = new Date().getTime();
    const expirationTime = cookie._expires && new Date(cookie._expires).getTime();
    const diff = (currentTime - expirationTime) / (1000 * 60);

    return diff;
  }
}

module.exports = {
  admin,
  authorization,
  authentication,
  session,
};
