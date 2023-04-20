const LocalStrategy = require('passport-local').Strategy;
const { auth, logger } = require('../config');
const passport = require('passport');
const userService = require('../services/users');
const passwords = require('../services/passwords');
const schemas = require('../services/schemas');

// Local auth setup
passport.use(new LocalStrategy({
  usernameField: auth.usernameField,
  passwordField: auth.passwordField,
  passReqToCallback: true,
}, async (req, email, password, done) => {
  const app_id = req.body.app_id;

  await schemas.apps.validateAsync({ id: app_id });
  await schemas.users.new.validateAsync({ email, password });

  const user = await userService.getUser({ filters: { email } });
  const shouldEncrypt = !req.headers['user-agent'] || req.headers['user-agent'].includes('PostmanRuntime');

  if (shouldEncrypt) password = passwords.encrypt(password);

  const isMatch = await passwords.validate({ client: password, server: user.password });

  if (!user || !isMatch) {
    logger.error('Incorrect email or password.');

    return done(null, false);
  }

  if (!user.is_admin && !app_id) {
    logger.error('Missing app_id.');

    return done(null, false);
  }

  return done(null, { app_id, ...user });
}));

// Serialize user
passport.serializeUser(({ id: user_id, app_id }, done) => {
  console.log('serialize')
  done(null, { user_id, app_id });
});

// Deserialize user
passport.deserializeUser(async ({ user_id, app_id }, done) => {
  const user = await userService.getUser({ filters: { id: user_id } });

  if (!user) {
    return done(new Error('User not found.'));
  }

  if (!user.is_admin && !user.apps.includes(app_id)) {
    return done(new Error('Missing app_id.'));
  }

  done(null, { app_id, ...user });
});

module.exports = passport;
