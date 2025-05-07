// routes/courseRoute.js
const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses
} = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');
const protect = require('../middleware/authMiddleware');

router.post('/create',protect, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:id/enroll',protect, enrollCourse);
router.get('/user/enrolled',protect, getEnrolledCourses);

module.exports = router;