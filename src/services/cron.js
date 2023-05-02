const cron = require('node-cron');
const { exec } = require('child_process');
const { logger } = require('../config');
const backblaze = require('./backblaze');
const cache = require('./cache');

function start() {
  cron.schedule('0 1 * * *', backupDB);  // Daily at 1:00 AM
  cron.schedule('0 * * * *', cleanCache);  // Hourly
  
  logger.info('Backup scheduler started.');
}

async function backupDB() {
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
}

function cleanCache() {
  logger.info('Cleaning cache...');

  for (item in cache) {
    if (cache[item].expires < Date.now()) {
      delete cache[item];
    }
  }

  logger.info('Cache cleaned successfully!');
}

module.exports = { start };
