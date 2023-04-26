require("dotenv").config();

const session = require('express-session');

const {
  PORT,
  NODE_ENV,
  API_KEY,
  DEV_DB_URL,
  PROD_DB_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SENDGRID_API_KEY,
} = process.env;
const auth = {
  sessionSecret: API_KEY,
  usernameField: "email",
  passwordField: "password",
  cookieMaxAge: 3600000, // 1 hour,
};
const sessionData = session({
  secret: API_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: auth.cookieMaxAge,
  },
});
const logger = require("pino")({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    }
  },
});
const cors = {
  origin: [
    "http://localhost:3000",
    "https://*.vercel.app",
  ],
  credentials: true,
};
const morgan = (NODE_ENV === 'production') ? 'tiny' : 'common';
const bodyParser = { limit: '50kb' };

module.exports = {
  PORT,
  NODE_ENV,
  API_KEY,
  DEV_DB_URL,
  PROD_DB_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SENDGRID_API_KEY,
  sessionData,
  bodyParser,
  morgan,
  cors,
  logger,
  auth,
};
