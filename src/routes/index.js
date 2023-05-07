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
const conversations = require('./conversations');
const messages = require('./messages');
const AI = require('./AI');
const GPTeams = require('./gpteams');
const GroupGPT = require('./groupgpt');
const PromptWiz = require('./promptwiz');

// Definitions
const public = express.Router();
const authorized = express.Router()
const authenticated = express.Router()
const admin = express.Router();
const authenticate = passport.authenticate('local');

//Auth
authorized.use(auth.authorization);
authenticated.use(auth.authorization, auth.authentication);
admin.use(authenticate, auth.admin);

// Routes
public
  .use(docs.serve)
  .get('/docs', docs.setup, docs.handler)
  .get(['/', '/favicon.ico'], health)
  .route('/utils/:service/:value?')
    .get(utils.generate)
    .post(utils.transform)

public
  .use('/gpteams', GPTeams)

authorized
  .get('/secrets', admin, secrets.reveal)
  .get('/apps', admin, apps.getAll)
  .get('/apps/:id', admin, apps.get)
  .get('/:app_id/users', admin, users.getAll)
  .post('/:app_id/register', users.create, authenticate, access.login)
  .post('/:app_id/login', authenticate, access.login)
  .post('/:app_id/passwords/reset', passwords.reset)
  .post('/:app_id/passwords/verify', passwords.verify)

// General | Apps | Misc
authenticated
  .post('/:app_id/logout', access.logout)
  .use(AI)
  .use('/promptwiz', PromptWiz)
  .use('/groupgpt', GroupGPT)
  .route('/:app_id/users/:user_id')
    .get(users.get)
    .patch(users.update)
    .delete(users.remove)
    
authenticated
  .route('/utils/:service/:value?')
    .get(utils.generate)
    .post(utils.transform)

// Conversations
authenticated
  .get('/:app_id/conversations', conversations.getAll)
  .get('/:app_id/conversations/:id', conversations.get)
  .post('/:app_id/conversations', conversations.create)
  .patch('/:app_id/conversations/:id', conversations.update)
  .delete('/:app_id/conversations/:id', conversations.remove)

// Messages
authenticated
  .get('/:app_id/messages', messages.getAll)
  .get('/:app_id/messages/:id', messages.get)
  .post('/:app_id/messages', messages.create)
  .patch('/:app_id/messages/:id', messages.update)
  .delete('/:app_id/messages/:id', messages.remove)

module.exports = { public, authorized, authenticated };
