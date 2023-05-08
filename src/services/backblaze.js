const B2 = require('backblaze-b2');
const fs = require('fs');
const {
  BACKBLAZE_APPLICATION_KEY_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
  logger,
} = require('../config');

const b2 = new B2({
  applicationKeyId: BACKBLAZE_APPLICATION_KEY_ID,
  applicationKey: BACKBLAZE_APPLICATION_KEY,
});

async function upload(path, fileName) {
  try {
    await b2.authorize();

    const bucketId = BACKBLAZE_BUCKET_ID;
    const file = fs.readFileSync(path + fileName);
    const response = await b2.getUploadUrl({ bucketId });
    const { uploadUrl, authorizationToken } = response.data;

    await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      bucketId,
      data: file,
    });

    logger.info(response, 'File uploaded successfully!');
  } catch (error) {
    logger.error(error, 'Error uploading DB backup file.');
  }
}

function getBackupFiles() {
  const path = 'src/db/';

  fs.readdir(path, (err, files) => {
    if (err) {
      logger.error(`Error reading directory: ${err}`);
      return;
    }

    const backupFiles = files.filter((file) => file.startsWith('backup_'));

    logger.info(backupFiles, 'Backup files:');

    return backupFiles;
  });
}

module.exports = { upload, getBackupFiles };
