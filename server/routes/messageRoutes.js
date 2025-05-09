 const express = require('express');
const router = express.Router();
const  {queryMessage, getQuery }= require('../controllers/messageController');


router.post('/send', queryMessage);
router.get('/teacher/:teacherId',getQuery);

module.exports = router;