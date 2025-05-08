const express = require('express');
const multer = require('multer');
const upload = multer();

const { 
  createCourse,
  getCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses,
  uploadLecture,
  courseCount
} = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', auth, createCourse);
router.get('/', getCourses);
router.get('/info', courseCount);
router.get('/:id', getCourseById);
router.post('/enroll', auth, enrollCourse);
router.get('/user/enrolled', auth, getEnrolledCourses);
router.post('/:id/lectures', auth,upload.none(), uploadLecture)


module.exports = router;