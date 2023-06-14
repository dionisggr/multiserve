const { PORT } = require('./src/config');
const { logger } = require('./src/utils');
const app = require('./src/app');
const cron = require('./src/services/cron');

// Cron Jobs
cron.start();

app.listen(PORT, () => {
  logger.info(`Running Tec3 API on port ${PORT}.`)
});
