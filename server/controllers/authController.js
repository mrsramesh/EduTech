// const User = require('../models/User');
// const bcrypt = require('bcryptjs');

// exports.register = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'User already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     const newUser = new User({ email, password: hashed });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid email' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

//     res.status(200).json({ message: 'Login successful' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { fname, lname, email, password,role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
      role,
    });

    await newuser.save();

    res.status(201).json({
      user: newUser,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

//     res.json({
//       user,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Create a custom user object without password
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role
    };

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,  // ✅ Add this line
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists and include role explicitly
//     const existingUser = await User.findOne({ email }).select('fname lname email role password');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     } 

//     if (!existingUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Validate password
//     const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Create JWT Token
//     const token = jwt.sign(
//       { id: existingUser._id },
//       process.env.JWT_SECRET || 'your_jwt_secret_key',
//       { expiresIn: '5d' }
//     );

//     // Send user data (excluding password) along with token
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         _id: existingUser._id,
//         fname: existingUser.fname,
//         lname: existingUser.lname,
//         email: existingUser.email,
//         role: existingUser.role, // ✅ Role included here
//       },
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Something went wrong', error: error.message });
//   }
// };

// module.exports = loginUser;

exports.updateProfile = async (req, res) => {
  const { id } = req.user;
  const updateData = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
