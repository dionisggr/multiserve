function reveal(req, res) {
  const {
    NODE_ENV,
    PORT,
    API_KEY,
    PROD_DB_URL,
    DEV_DB_URL,
    ADMIN_PASSWORD,
    SENDGRID_API_KEY,
    BACKBLAZE_APP_ID,
    BACKBLAZE_APP_KEY_ID,
    BACKBLAZE_BUCKET_ID,
    OPENAI_API_KEY,
  } = process.env;

  res.set('Content-Type', 'text/plain');
  res.send(JSON.stringify({
    NODE_ENV,
    PORT,
    API_KEY,
    PROD_DB_URL,
    DEV_DB_URL,
    ADMIN_PASSWORD,
    SENDGRID_API_KEY,
    BACKBLAZE_APP_ID,
    BACKBLAZE_APP_KEY_ID,
    BACKBLAZE_BUCKET_ID,
    OPENAI_API_KEY,
  }, null, 2));
}

module.exports = { reveal };
