// routes/courseRoute.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {

  createCourse,
  getCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses,
  uploadLecture,
  getAvailableCourses
} = require('../controllers/courseController');
const protect = require('../middleware/authMiddleware');

router.post('/create',protect, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.get('/user/enrolled', protect, getEnrolledCourses);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/lectures', protect, upload.single('video'), uploadLecture);
router.get('/user/available', protect, getAvailableCourses); // Add this new route


module.exports = router;