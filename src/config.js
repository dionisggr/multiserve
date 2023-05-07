require("dotenv").config();

const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisClient = require('redis').createClient();

const {
  PORT,
  NODE_ENV,
  API_KEY,
  DEV_DB_URL,
  PROD_DB_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SENDGRID_API_KEY,
  OPENAI_API_KEY,
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_CHANNEL,
} = process.env;

if (NODE_ENV === 'development') {
  (async () => await redisClient.connect())();
}

const auth = {
  sessionSecret: API_KEY,
  usernameField: "email",
  passwordField: "password",
  cookieMaxAge: 3600000, // 1 hour,
};
const sessionData = session({
  store: new RedisStore({ client: redisClient }),
  secret: API_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === "production",
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
const helmet = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "img.example.com"],
      scriptSrc: ["'self'", "scripts.example.com"],
    },
  },
  expectCt: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 60 * 60 * 24 * 365, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true,
}
const morgan = (NODE_ENV === 'production') ? 'tiny' : 'common';

module.exports = {
  PORT,
  NODE_ENV,
  API_KEY,
  DEV_DB_URL,
  PROD_DB_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SENDGRID_API_KEY,
  OPENAI_API_KEY,
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_CHANNEL,
  sessionData,
  helmet,
  morgan,
  cors,
  logger,
  auth,
};
