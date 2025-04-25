// const express = require('express');
// const router = express.Router();
// const { register, login } = require('../controllers/authController');

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;


const express = require("express");
const { registerUser, loginUser, updateProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/multer"); // Import the middleware
const { getTeachers } = require("../controllers/getTeachers");
const { getStudents } = require("../controllers/getStudents");
const { getAllUsers } = require("../controllers/getalluser");
const { textauthuser } = require("../controllers/textauthuser");



const router = express.Router();

router.post("/register", upload.single('profileImage'), registerUser);
router.post("/login", loginUser);
router.post("/profile", protect, updateProfile);

// GET API: Get all users with role "teacher"
router.get('/teachers', getTeachers);
router.get('/students', getStudents);
router.get('/alluser', getAllUsers);
router.post('/test', textauthuser);




module.exports = router;
