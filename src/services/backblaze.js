const fs = require('fs');
const B2 = require('backblaze-b2');
const { exec } = require('child_process');
const { logger } = require('../utils');
const {
  BACKBLAZE_APPLICATION_KEY_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
} = require('../config');

const b2 = new B2({
  applicationKeyId: BACKBLAZE_APPLICATION_KEY_ID,
  applicationKey: BACKBLAZE_APPLICATION_KEY,
});

function backupDB() {
  return new Promise((resolve, reject) => {
    logger.info('Backup scheduler started.');
    logger.info('Creating DB backup file...');

    exec('src/db/backup.sh', async (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error creating DB backup file: ${error.message}`);
        return reject(error);
      }

      logger.info('DB backup file created successfully!');

      const files = await getFiles();

      logger.info('Uploading DB backup file...');

      const uploads = files.map(name => upload('src/db/backups/', name));
      try {
        await Promise.all(uploads);
        logger.info('DB backup file uploaded successfully!');
        resolve();
      } catch (error) {
        logger.error(`Error uploading DB backup file: ${error.message}`);
        reject(error);
      }
    });
  });
}

function getFiles() {
  const path = 'src/db/backups/';

  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        logger.error(`Error reading directory: ${err}`);
        reject(err);
        return;
      }

      const backupFiles = files.filter(file => file.startsWith('backup_'));
      logger.info(`Backup files: ${backupFiles}`);
      resolve(backupFiles);
    });
  });
}

async function upload(path, fileName) {
  try {
    await b2.authorize();

    const bucketId = BACKBLAZE_BUCKET_ID;
    const filePath = path + fileName;
    const response = await b2.getUploadUrl({ bucketId });
    const { uploadUrl, authorizationToken } = response.data;
    const file = fs.createReadStream(filePath);
    
    await b2.uploadFile({
      data: file,
      uploadAuthToken: authorizationToken,
      uploadUrl,
      fileName,
      bucketId,
    });

    fs.unlinkSync(filePath);

    logger.info('DB file upload success');
  } catch (error) {
    logger.error(error, 'Error uploading DB backup file.');
    throw error;
  }
}

module.exports = { backupDB };
