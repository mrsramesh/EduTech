
const express = require("express");
const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const { getTeachers } = require("../controllers/getTeachers");
const { getStudents } = require("../controllers/getStudents");
const { getAllUsers, getMe } = require("../controllers/getalluser");
const { textauthuser } = require("../controllers/textauthuser");
const { rozerpay } = require("../controllers/rozerpay");

const router = express.Router();

router.post("/register", upload.single('profileImage'), registerUser);
router.post("/login", loginUser);
router.post("/profile", protect, updateProfile);
router.get('/teachers', getTeachers);
router.get('/students', getStudents);
router.get('/alluser', getAllUsers);
router.post('/test', textauthuser);
router.post('/pay', rozerpay);
router.get('/me', protect, getMe);

module.exports = router;
