const express = require('express');
const health = require('./health');
const passport = require('../middleware/passport');
const auth = require('../middleware/auth');
const access = require('./access');
const docs = require('./docs');
const users = require('./users');
const utils = require('./utils');
const secrets = require('./secrets');

// Definitions
const public = express.Router();
const authorized = express.Router();
const authenticated = express.Router();
const admin = express.Router();
const authenticate = passport.authenticate('local');
const docRoutes = [
  '/docs',
  '/login',
  '/register',
  '/users',
  '/utils'
];

// Auth
authorized.use(auth.authorization);
authenticated.use(auth.authorization, auth.authentication);

// Routes
public
  .use(docs.serve)
  .get(docRoutes, docs.setup, docs.handler)
  .get(['/', '/favicon.ico'], health)

public.route('/utils/:service/:value?')
  .get(utils.generate)
  .post(utils.transform)

authorized
  .get('/secrets', authenticate, auth.admin, secrets.reveal)
  .get('/apps/:id/users', users.getAll)
  .post('/apps/:id/login', authenticate, access.login)
  .post('/apps/:id/register', users.create, authenticate, access.login)

authenticated
  .post('/apps/:id/logout', access.logout)
  
authenticated.route('/apps/:app_id/users/:user_id')
  .get(users.get)
  .patch(users.update)
  .delete(users.remove)

module.exports = { public, authorized, authenticated };
