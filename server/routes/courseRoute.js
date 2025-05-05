const express = require('express');
const { 
  createCourse,
  getCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses
} = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/enroll', auth, enrollCourse);
router.get('/user/enrolled', auth, getEnrolledCourses);

module.exports = router;