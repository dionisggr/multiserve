const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const routers = require('./routes/routers');
const passport = require('./middleware/passport');
const errorHandler = require('./middleware/error-handler');
const { xss } = require('express-xss-sanitizer');

// Initialize
const app = express();

// Session-based authentication
app.use(
  config.sessionData,
  passport.initialize(),
  passport.session(),
);

// Middleware
app.use(
  helmet(),
  express.json(config.bodyParser),
  xss(),
  cors(config.cors),
  morgan(config.morgan),
);

// Routers
app.use(routers.secret);
app.use(routers.public);
app.use(routers.authorized);
app.use(routers.authenticated);

// Error handling
app.use(errorHandler);

module.exports = app;
