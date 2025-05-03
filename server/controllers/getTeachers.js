const User = require("../models/User");
const asyncHandler = require('express-async-handler');

exports.getTeachers = asyncHandler(async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('fname lname email role');

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      message: "Server Error. Could not fetch teachers.",
      error: error.message,
    });
  }
});

// yi api work kar rahi hai teachers data find karne me db se . 