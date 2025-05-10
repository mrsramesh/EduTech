// routes/courseRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  createCourse,
  getCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses,
  uploadLecture,
  getAvailableCourses,
  courseCount,
  myCourses,
} = require("../controllers/courseController");
const protect = require("../middleware/authMiddleware");
const { getTeacherEarnings } = require("../controllers/earningController");

router.post("/create", protect, createCourse);
router.get("/", getCourses);
router.get("/info", courseCount);
router.get("/:id", protect, getCourseById);
router.get("/user/enrolled", protect, getEnrolledCourses);
router.post("/:id/enroll", protect, enrollCourse);
router.post("/:id/lectures", protect, upload.single("video"), uploadLecture);
router.get("/user/available", protect, getAvailableCourses);
router.get("/my-courses/:id", protect, myCourses);
router.get("/earnings/teacher", protect, getTeacherEarnings);

module.exports = router;
