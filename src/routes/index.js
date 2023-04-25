const express = require('express');
const health = require('./health');
const passport = require('../middleware/passport');
const auth = require('../middleware/auth');
const access = require('./access');
const docs = require('./docs');
const apps = require('./apps');
const users = require('./users');
const passwords = require('./passwords');
const utils = require('./utils');
const secrets = require('./secrets');

// Definitions / Auth
const public = express.Router();
const authorized = express.Router().use(auth.authorization);
const authenticated = express.Router().use(auth.authorization, auth.authentication);
const authenticate = passport.authenticate('local');
// const admin = express.Router().use(authenticate, auth.admin);

// Routes
public
  .use(docs.serve)
  .get('/docs', docs.setup, docs.handler)
  .get(['/', '/favicon.ico'], health)
  .route('/utils/:service/:value?')
    .get(utils.generate)
    .post(utils.transform)

authorized
  .get('/secrets', authenticate, auth.admin, secrets.reveal)
  .get('/apps', authenticate, auth.admin, apps.getAll)
  .get('/apps/:id', authenticate, auth.admin, apps.get)
  .get('/apps/:id/users', authenticate, auth.admin, users.getAll)
  .post('/apps/:id/register', users.create, authenticate, access.login)
  .post('/apps/:id/login', authenticate, access.login)
  .post('/apps/:id/passwords/verify', passwords.verify)
  .post('/apps/:id/passwords/reset', passwords.reset)

authenticated
  .post('/apps/:id/logout', access.logout)
  .route('/apps/:app_id/users/:user_id')
    .get(users.get)
    .patch(users.update)
    .delete(users.remove)

module.exports = { public, authorized, authenticated };
