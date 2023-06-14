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
const AI = require('./AI');
const GPTeams = require('./gpteams');
const ChatterAI = require('./chatterai');
const PromptWiz = require('./promptwiz');
const StatusPage = require('./gpteams/incidents');
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
  .use('/:app_id',
    express.Router({ mergeParams: true })
      .post('/login', auth.login)
      .post('/reauthorize', auth.reauthorize)
      .post('/signup', users.create, auth.login)
      .post('/passwords/reset', passwords.reset)
      .post('/passwords/verify', passwords.verify))

authenticated
  .use('/:app_id', express.Router({ mergeParams: true })
    .post('/logout', auth.logout)
    .use('/users/:user_id', express.Router({ mergeParams: true })
      .get('/', users.get)
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

authenticated
  .use(AI)
  .use('/statuspage', StatusPage)
  .use('/promptwiz', PromptWiz)
  .use('/chatterai', ChatterAI)
  .use('/gpteams', GPTeams)

admin
  .get('/secrets', secrets.reveal)
  .get('/:app_id/users', users.getAll)
  .use('/apps', express.Router()
    .get('/', apps.getAll)
    .get('/:id', apps.get))

module.exports = { public, authorized, authenticated, admin };
