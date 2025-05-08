// routes/courseRoute.js
const express = require('express');
const router = express.Router();
const {
const multer = require('multer');
const upload = multer();

  createCourse,
  getCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses,
  uploadLecture,
  courseCount
} = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');
const protect = require('../middleware/authMiddleware');

router.post('/create',protect, createCourse);
router.get('/', getCourses);
router.get('/info', courseCount);
router.get('/:id', getCourseById);
router.post('/:id/enroll',protect, enrollCourse);
// router.get('/user/enrolled',protect, getEnrolledCourses);
router.post('/enroll', auth, enrollCourse);
router.get('/user/enrolled', auth, getEnrolledCourses);
router.post('/:id/lectures', auth,upload.single('video'), uploadLecture)


module.exports = router;