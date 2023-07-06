const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { xss } = require('express-xss-sanitizer');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./config');
const routers = require('./routes');
const middleware = {
  errorHandler: require('./middleware/error-handler'),
};

// Initialize app
const app = express();

// Middleware
app.use(
  helmet(config.helmet),
  cors(config.cors),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json({ limit: '10mb' }),
  xss(),
  morgan(config.morgan),
);

// Routers
app.use(routers.public);
app.use(routers.authorized);
app.use(routers.authenticated);
app.use(routers.admin)

// Error handling
app.use(middleware.errorHandler);

module.exports = app;
