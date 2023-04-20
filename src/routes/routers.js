const express = require('express');
const { authentication, authorization, admin } = require('../middleware/auth');
const health = require('./health');
const login = require('./login');
const docs = require('./docs');
const passport = require('../middleware/passport');
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
authorized.use(authorization);
authenticated.use(authorization, authentication);
authenticated.route('/*/all').all(admin);

// Health Check
public
  .use(docs.serve)
  .get('/', health)
  .get(docRoutes, docs.setup, docs.handler)
  .get('/utils/:service', utils.generate)
  .post('/utils/:service', utils.transform)

// Login
authorized
  .post('/login', passport.authenticate('local'), login);

// Admin
authenticated
  .get('/users/all', users.getAllProfiles)
  .get('/apps/all', apps.get)

// Users
authorized
  .post('/register', users.createProfile)

authenticated.route('/users/:id')
  .get(users.getProfile)
  .patch(users.updateProfile)
  .delete(users.deleteProfile);

module.exports = { public, authorized, authenticated };
