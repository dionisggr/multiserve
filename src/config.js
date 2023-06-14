require("dotenv").config();

const {
  PORT,
  NODE_ENV,
  API_KEY,
  DEV_DB_URL,
  PROD_DB_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  OPENAI_API_KEY,
  SENDGRID_API_KEY,
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_ADMIN_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_CHANNEL,
  BACKBLAZE_APPLICATION_KEY_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
  STATUSPAGE_PAGE_ID,
  STATUSPAGE_TEC3_API_ID,
  STATUSPAGE_GPTEAMS_ID,
  STATUSPAGE_API_KEY,
  STATUSPAGE_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;
const cors = {
  origin: [
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://*.railway.app",
  ],
  credentials: true,
};
const helmet = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 60 * 60 * 24 * 365,
    includeSubDomains: true,
    preload: true
  },
  hidePoweredBy: true,
  noSniff: true,
  xssFilter: true,
}
const morgan = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

module.exports = {
  PORT,
  NODE_ENV,
  API_KEY,
  DEV_DB_URL,
  PROD_DB_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  OPENAI_API_KEY,
  SENDGRID_API_KEY,
  SLACK_GPTEAMS_DM_TOKEN,
  SLACK_GPTEAMS_ADMIN_TOKEN,
  SLACK_GPTEAMS_BOT_ID,
  SLACK_GPTEAMS_BOT_CHANNEL,
  BACKBLAZE_APPLICATION_KEY_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
  STATUSPAGE_PAGE_ID,
  STATUSPAGE_TEC3_API_ID,
  STATUSPAGE_GPTEAMS_ID,
  STATUSPAGE_API_KEY,
  STATUSPAGE_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  helmet,
  morgan,
  cors,
};
