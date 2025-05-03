const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Get all users (students + teachers + others)
exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select('fname lname email role profileImage');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server Error. Could not fetch users.",
      error: error.message,
    });
  }
});

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
