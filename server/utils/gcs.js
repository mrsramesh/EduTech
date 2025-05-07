const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Load credentials JSON
const keyPath = path.join(__dirname, '../pborbit-dev-7856c1fa137d.json'); // <- your service account file
const storage = new Storage({ keyFilename: keyPath });

const bucketName = 'edutech_uploaded_videos'; // replace with your actual bucket name
const bucket = storage.bucket(bucketName);

const uploadToGCS = (file) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(Date.now() + '-' + file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on('error', (err) => reject(err));
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = uploadToGCS;
