const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login user and verify password
exports.textauthuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login
    return res.status(200).json({
      message: "Login successful",
      fname: user.fname,
      role: user.role
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
