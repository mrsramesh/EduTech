const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Get all students
exports.getStudents = asyncHandler(async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('fname lname email role');

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      message: "Server Error. Could not fetch students.",
      error: error.message,
    });
  }
});
