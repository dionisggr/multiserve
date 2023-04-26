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
const authorized = express.Router()
const authenticated = express.Router()
const authenticate = passport.authenticate('local');
const admin = express.Router().use(authenticate, auth.admin);

//Auth
authorized.use(auth.authorization);
authenticated.use(auth.authorization, auth.authentication);

// Routes
public
  .use(docs.serve)
  .get('/docs', docs.setup, docs.handler)
  .get(['/', '/favicon.ico'], health)
  .route('/utils/:service/:value?')
    .get(utils.generate)
    .post(utils.transform)

authorized
  .get('/secrets', admin, secrets.reveal)
  .get('/apps', admin, apps.getAll)
  .get('/apps/:id/users', admin, users.getAll)
  .get('/apps/:id', admin, apps.get)
  .post('/apps/:id/register', users.create, authenticate, access.login)
  .post('/apps/:id/login', authenticate, access.login)
  .post('/apps/:id/passwords/reset', passwords.reset)
  .post('/apps/:id/passwords/verify', passwords.verify)
  
authenticated
  .post('/apps/:id/logout', access.logout)
  .route('/apps/:app_id/users/:user_id')
    .get(users.get)
    .patch(users.update)
    .delete(users.remove)

module.exports = { public, authorized, authenticated };
