const cron = require('node-cron');
const { exec } = require('child_process');
const { logger } = require('../config');
const backblaze = require('./backblaze');

function start() {
  // Runs daily at 1:00 AM
  cron.schedule('0 1 * * *', async () => {
    logger.info('Creating DB backup file...');

    exec('src/db/backup.sh', (error, stdout, stderr) => {
      if (error) {
        logger.error(error, 'Error creating DB backfup file.');

        return;
      }

      logger.info('DB backup file created successfully!');
    });

    const files = backblaze.getBackupFiles();

    logger.info('Uploading DB backup file...');

    for (const name of files) {
      await backblaze.upload('src/db/', name);
    }

    logger.info('DB backup file uploaded successfully!');
  });

  logger.info('Backup scheduler started.')
}

module.exports = { start };
