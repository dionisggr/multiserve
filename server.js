const { PORT, logger } = require('./src/config');
const app = require('./src/app');

app.listen(PORT, () => {
  logger.info(`Running Tec3 API on port ${PORT}.`)
});
