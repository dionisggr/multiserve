const cron = require('node-cron');
const { backupDB } = require('./backblaze');

function start() {
  cron.schedule('0 1 * * *', backupDB);  // Daily at 1:00 AM
}

module.exports = { start };
