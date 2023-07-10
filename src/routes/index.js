const express = require('express');
const health = require('./health');
const docs = require('./docs');
const apps = require('./apps');
const users = require('./users');
const passwords = require('./passwords');
const utils = require('./utils');
const secrets = require('./secrets');
const conversations = require('./conversations');
const messages = require('./messages');
const { Router: AI } = require('./AI');
const ChatterAI = require('./chatterai');
const PromptWiz = require('./promptwiz');
const auth = {
  ...require('../middleware/auth'),
  ...require('./auth'),
}

const public = express.Router();
const authorized = express.Router().use(auth.app);
const authenticated = express.Router().use(auth.user);
const admin = express.Router().use(auth.admin);

public
  .use(docs.serve)
    .get('/docs', docs.setup, docs.handler)
    .get(['/', '/favicon.ico'], health)
    .route('/utils/:service/:value?')
      .get(utils.generate)
      .post(utils.transform)
    
authorized
  .use('/:app_id', express.Router({ mergeParams: true })
    .get('/users/:user_id', users.get)
    .get('/auth-check', auth.check)
    .post('/login', auth.login)
    .post('/reauthorize', auth.reauthorize)
    .post('/signup', users.create, auth.login)
    .post('/google', auth.google)
    .use('/passwords', express.Router({ mergeParams: true })
      .post('/reset', passwords.reset)))

authenticated
  .use('/:app_id', express.Router({ mergeParams: true })
    .post('/passwords/mfa', passwords.mfa)
    .post('/logout', auth.logout)
    .use('/users/:user_id', express.Router({ mergeParams: true })
      .post('/passwords/reset', passwords.reset)
      .patch('/', users.update)
      .delete('/', users.remove))
    .use('/conversations', express.Router({ mergeParams: true })
      .get('/', conversations.getAll)
      .post('/', conversations.create)
      .use('/:conversation_id', express.Router({ mergeParams: true })
        .get('/', conversations.get)
        .patch('/', conversations.update)
        .delete('/', conversations.remove)
        .use('/messages', express.Router({ mergeParams: true })
          .get('/', messages.getAll)
          .post('/', messages.create)
          .use('/:message_id', express.Router({ mergeParams: true })
            .get('/', messages.get)
            .patch('/', messages.update)
            .delete('/', messages.remove))))))
  .use(AI)
  .use('/promptwiz', PromptWiz)
  .use('/chatterai', ChatterAI)

admin
  .get('/secrets', secrets.reveal)
  .get('/:app_id/users', users.getAll)
  .use('/apps', express.Router()
    .get('/:id', apps.get)
    .get('/', apps.getAll))

module.exports = { public, authorized, authenticated, admin };
