const uploadFile = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Expo से आए base64 डेटा को हैंडल करें
      const fileData = {
        url: req.file.buffer.toString('base64'),
        type: req.file.mimetype,
        name: req.file.originalname,
        size: req.file.size
      };
  
      res.status(200).json({
        success: true,
        file: fileData
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  };
  
  // Expo के लिए बेस64 डेटा हैंडल करने वाला वर्जन
  const uploadBase64File = async (req, res) => {
    try {
      const { file, fileName, fileType } = req.body;
      
      if (!file || !fileName || !fileType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const fileData = {
        url: file, // बेस64 स्ट्रिंग
        type: fileType,
        name: fileName
      };
  
      res.status(200).json({
        success: true,
        file: fileData
      });
    } catch (error) {
      console.error('Base64 upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  };
  
  module.exports = {
    uploadFile,
    uploadBase64File
  };