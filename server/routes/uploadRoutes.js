const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

// मल्टर कॉन्फिगरेशन (सामान्य सर्वर अपलोड के लिए)
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB लिमिट
  }
});

// रूट्स
router.post('/server', upload.single('file'), uploadController.uploadFile);
router.post('/expo', uploadController.uploadBase64File);

module.exports = router;