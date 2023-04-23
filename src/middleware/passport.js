const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { isBrowserRequest, isAdminRequest } = require('../utils');
const schemas = require('../schemas');
const Service = require('../services');
const { auth, logger } = require('../config');

// Local auth setup
passport.use(new LocalStrategy({
  usernameField: auth.usernameField,
  passwordField: auth.passwordField,
  passReqToCallback: true,
}, async (req, email, password, done) => {
  const app_id = req.params.id || req.params.app_id || req.body.app_id;

  if (app_id) {
    await schemas.users.new.validateAsync({ email, password, app_id });
  } else {
    await schemas.users.existing.validateAsync({ email, password });
  }

  const service = await new Service().use(app_id);
  const user = await service.users.get({ filters: { email } });

  if (!user) {
    logger.error({ email }, 'Incorrect email or password.');

    return done(null, false);
  }

  if (!isBrowserRequest(req)) {
    password = service.passwords.encrypt(password);
  }

  const isAuthenticated = await service.passwords.validate({
    client: password,
    server: user.password
  });

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    logger.error({ email }, 'Incorrect email or password.');

    return done(null, false);
  }

  return done(null, { ...user, app_id });
}));

// Serialize user to session
passport.serializeUser((user, done) => { done(null, user) });

// Deserialize user from stored session
passport.deserializeUser(async (authenticated, done) => {
  const { id, email, password, app_id } = authenticated;

  await schemas.users.existing.validateAsync({ id });
  await schemas.apps.validateAsync({ id: app_id });

  const service = await new Service().use(app_id);

  const user = await service.users.get({
    filters: { id, email, password },
  });

  if (!user) {
    return done(new Error('Authentication failed.'));
  }

  done(null, authenticated);
});

module.exports = passport;
