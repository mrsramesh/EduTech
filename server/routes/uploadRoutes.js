const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});

router.post('/server', upload.single('file'), uploadController.uploadFile);
router.post('/expo', uploadController.uploadBase64File);

module.exports = router;