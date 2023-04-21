function reveal(req, res) {
  const {
    NODE_ENV,
    PORT,
    API_KEY,
    PROD_DB_URL,
    DEV_DB_URL,
    ADMIN_PASSWORD,
  } = process.env;

  res.set('Content-Type', 'text/plain');
  res.send(JSON.stringify({
    NODE_ENV,
    PORT,
    API_KEY,
    PROD_DB_URL,
    DEV_DB_URL,
    ADMIN_PASSWORD,
  }, null, 2));
}

module.exports = { reveal };