const express = require('express');
const { createCourse } =  require('../controllers/courseController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect , createCourse);


module.exports = router;
