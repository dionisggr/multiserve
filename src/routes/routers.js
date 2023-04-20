const express = require('express');
const health = require('./health');
const passport = require('../middleware/passport');
const auth = require('../middleware/auth');
const access = require('./access');
const docs = require('./docs');
const users = require('./users');
const apps = require('./apps');
const utils = require('./utils');

// Definitions
const public = express.Router();
const authorized = express.Router();
const authenticated = express.Router();
const docRoutes = [
  '/docs',
  '/login',
  '/register',
  '/users',
  '/utils'
];

// Auth Setup
authorized.use(auth.authorization);
authenticated.use(auth.authorization, auth.authentication);
authenticated.route('/*/all').all(auth.admin);

// Health Check
public
  .use(docs.serve)
  .get('/', health)
  .get(docRoutes, docs.setup, docs.handler)
  .get('/utils/:service', utils.generate)
  .post('/utils/:service', utils.transform)

// Login
authorized
  .post('/login', passport.authenticate('local'), access.login);

// Admin
authenticated
  .get('/users/all', users.getAllProfiles)
  .get('/apps/:id', apps.get)

// Users
authorized
  .post('/register', users.createProfile, passport.authenticate('local'))

authenticated.route('/users/:id')
  .get(users.getProfile)
  .patch(users.updateProfile)
  .delete(users.deleteProfile);

authenticated
  .post('/logout', access.logout)
  
module.exports = { public, authorized, authenticated };
