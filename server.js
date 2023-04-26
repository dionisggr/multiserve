const { PORT, logger } = require('./src/config');
const app = require('./src/app');

app.listen(PORT, () => {
  logger.info(`Running Baseport on port ${PORT}.`)
});
