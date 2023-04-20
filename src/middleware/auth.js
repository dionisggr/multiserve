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
  const { body: request, user: authenticated } = req;
  const error = new Error(errors.authentication[NODE_ENV]);
  error.status = 401;

  if (!req.isAuthenticated()) return next(error);

  await validateCookie(req.session)

  if (request.app_id !== authenticated.app_id) {
    return next(error);
  }

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

const cookie = {
  validate: async (req, res, next) => {
    const { cookie } = req.session;

    const currentDate = new Date().getTime();
    const expirationDate = cookie._expires && new Date(cookie._expires).getTime();
    const diff = (expirationDate.getTime() - currentDate.getTime()) / (1000 * 60);

    if (diff < 30) await req.session.regenerate();

    next();
  }
}

module.exports = {
  admin,
  authorization,
  authentication,
  cookie,
};
