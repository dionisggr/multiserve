const jwt = require('jsonwebtoken');
const { API_KEY, JWT_ACCESS_SECRET } = require('../config');
const { customError } = require('../utils');
const db = require('../db');

function app(req, res, next) {
  const apiKey = req.get('Authorization')?.split(' ')[1];

  if (req.path === 'login' && (!apiKey || apiKey !== API_KEY)) {
    return next(customError('Missing or invalid API key.', 401));
  }

  next();
}

function user(req, res, next) {
  const token = req.get('Authorization')?.split(' ')[1];

  try {
    req.auth = jwt.verify(token, JWT_ACCESS_SECRET);

    next();
  } catch (error) {
    next(error);
  }
};

async function admin(req, res, next) {
  const token = req.get('Authorization')?.split(' ')[1];
  const { email, password } = req.body;

  if (token) {
    req.auth = jwt.decode(token, JWT_ACCESS_SECRET);

    if (!req.auth?.is_admin) {
      return next(customError('Unauthorized admin access.', 401));
    }
  }  else if (email && password) {
    const user = await db(`${app_id}__users`).where({ email }).first();
    const match = user && await bcrypt.compare(password, user.password);

    if (!match) {
      return next(customError('Missing or invalid credentials.', 401));
    }
  } else {
    return next(customError('Missing or invalid admin token or credentials.', 401));
  }

  next();
};

module.exports = { app, user, admin };
